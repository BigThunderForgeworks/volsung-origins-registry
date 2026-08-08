import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

function useManageCompany(companyTag) {
  const [company, setCompany] = useState(null)
  const [licenseTypes, setLicenseTypes] = useState([])
  const [companyLicenses, setCompanyLicenses] = useState([])
  const [affiliationRequests, setAffiliationRequests] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    loadManagementContext()
  }, [companyTag])

  async function loadManagementContext() {
    setIsLoading(true)
    setErrorMessage("")

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setErrorMessage(
        userError?.message ??
          "You must be signed in to manage a Company."
      )
      setIsLoading(false)
      return
    }

    const { data: profile, error: profileError } =
        await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

    if (profileError) {
    setErrorMessage(profileError.message)
    setIsLoading(false)
    return
    }

    const isAdmin = profile?.role === "admin"

    const { data: companyRecord, error: companyError } =
      await supabase
        .from("companies")
        .select(`
          id,
          faction_id,
          name,
          short_name,
          description,
          logo_url,
          owner_id,
          founder_name,
          founded_date,
          motto,
          primary_color,
          secondary_color,
          recruiting,
          status,
          factions (
            id,
            name,
            short_name
          )
        `)
        .eq("short_name", companyTag?.toUpperCase())
        .maybeSingle()

    if (companyError) {
      setErrorMessage(companyError.message)
      setIsLoading(false)
      return
    }

    if (!companyRecord) {
      setErrorMessage("Company record not found.")
      setIsLoading(false)
      return
    }

    if (
        companyRecord.owner_id !== user.id &&
        !isAdmin
    ) {
        setErrorMessage(
            "Only the Company owner or an administrator may access these management controls."
        )
        setIsLoading(false)
        return
    }

    setCompany(companyRecord)

    const [
      { data: licenseRecords, error: licenseError },
      { data: licenseTypeRecords, error: licenseTypeError },
      { data: affiliationRecords, error: affiliationError },
    ] = await Promise.all([
      supabase
        .from("company_licenses")
        .select(`
          id,
          company_id,
          license_type_id,
          status,
          created_at,
          license_types (
            id,
            name,
            short_name,
            classification,
            summary
          )
        `)
        .eq("company_id", companyRecord.id)
        .order("created_at", { ascending: true }),

      supabase
        .from("license_types")
        .select(`
          id,
          name,
          short_name,
          classification,
          summary
        `)
        .eq("status", "active")
        .order("name", { ascending: true }),

      supabase
        .from("company_affiliation_requests")
        .select(`
          id,
          company_id,
          faction_id,
          status,
          created_at,
          updated_at,
          factions!company_affiliation_requests_faction_id_fkey (
            id,
            name,
            short_name
            )
        `)
        .eq("company_id", companyRecord.id)
        .order("created_at", { ascending: false }),
    ])

    const firstError =
      licenseError ??
      licenseTypeError ??
      affiliationError

    if (firstError) {
      setErrorMessage(firstError.message)
      setIsLoading(false)
      return
    }

    setCompanyLicenses(licenseRecords ?? [])
    setLicenseTypes(licenseTypeRecords ?? [])
    setAffiliationRequests(affiliationRecords ?? [])

    setIsLoading(false)
  }

  async function updateCompanyProfile(values) {
    if (!company) {
      return false
    }

    setIsSaving(true)
    setSaveError("")

    const { error } = await supabase
      .from("companies")
      .update({
        description: values.description.trim() || null,
        logo_url: values.logoUrl.trim() || null,
        motto: values.motto.trim() || null,
        primary_color:
          values.primaryColor.trim().toUpperCase() || null,
        secondary_color:
          values.secondaryColor.trim().toUpperCase() || null,
        founded_date: values.foundedDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", company.id)

    if (error) {
      setSaveError(error.message)
      setIsSaving(false)
      return false
    }

    await loadManagementContext()
    setIsSaving(false)

    return true
  }

  async function updateRecruiting(recruiting) {
    if (!company) {
      return false
    }

    setIsSaving(true)
    setSaveError("")

    const { error } = await supabase
      .from("companies")
      .update({
        recruiting,
        updated_at: new Date().toISOString(),
      })
      .eq("id", company.id)

    if (error) {
      setSaveError(error.message)
      setIsSaving(false)
      return false
    }

    await loadManagementContext()
    setIsSaving(false)

    return true
  }

  function clearSaveError() {
    setSaveError("")
  }

  return {
    company,
    licenseTypes,
    companyLicenses,
    affiliationRequests,

    isLoading,
    isSaving,

    errorMessage,
    saveError,

    updateCompanyProfile,
    updateRecruiting,
    clearSaveError,
    reload: loadManagementContext,
  }
}

export default useManageCompany