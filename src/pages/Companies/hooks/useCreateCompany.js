import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

function useCreateCompany() {
  const [licenseTypes, setLicenseTypes] = useState([])
  const [availableFactions, setAvailableFactions] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    loadCreateContext()
  }, [])

  async function loadCreateContext() {
    setIsLoading(true)
    setErrorMessage("")

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setErrorMessage(
        userError?.message ??
          "You must be signed in to create a company."
      )
      setIsLoading(false)
      return
    }

    const { data: licenses, error: licenseError } =
      await supabase
        .from("license_types")
        .select(`
          id,
          name,
          short_name,
          summary
        `)
        .order("name", { ascending: true })

    if (licenseError) {
      setErrorMessage(licenseError.message)
      setIsLoading(false)
      return
    }

    setLicenseTypes(licenses ?? [])

    const { data: memberships, error: membershipError } =
      await supabase
        .from("faction_memberships")
        .select(`
          faction_id,
          factions (
            id,
            name,
            short_name,
            status
          )
        `)
        .eq("profile_id", user.id)
        .eq("status", "approved")

    if (membershipError) {
      setErrorMessage(membershipError.message)
      setIsLoading(false)
      return
    }

    const factions =
      memberships
        ?.map((membership) => membership.factions)
        .filter(
          (faction) =>
            faction &&
            faction.status === "active"
        ) ?? []

    setAvailableFactions(factions)
    setIsLoading(false)
  }

  async function submitCompany({
    formData,
    selectedLicenseIds,
  }) {
    setSubmitError("")

    const companyName = formData.name.trim()
    const companyTag = formData.shortName
      .trim()
      .toUpperCase()

    if (!companyName) {
      setSubmitError("Enter a company name.")
      return null
    }

    if (!/^[A-Z]{2,3}$/.test(companyTag)) {
      setSubmitError(
        "Company tag must contain two or three letters."
      )
      return null
    }

    if (!formData.description.trim()) {
      setSubmitError("Enter a company description.")
      return null
    }

    if (!formData.foundedDate) {
      setSubmitError("Select the company founded date.")
      return null
    }

    if (
      selectedLicenseIds.length < 1 ||
      selectedLicenseIds.length > 2
    ) {
      setSubmitError(
        "Select one or two operating licenses."
      )
      return null
    }

    setIsSubmitting(true)

    const { data, error } = await supabase.rpc(
    "create_company",
    {
        p_name: companyName,
        p_short_name: companyTag,
        p_description: formData.description.trim(),
        p_logo_url: formData.logoUrl.trim() || null,
        p_founded_date: formData.foundedDate,
        p_motto: formData.motto.trim() || null,
        p_primary_color:
        formData.primaryColor.trim() || null,
        p_secondary_color:
        formData.secondaryColor.trim() || null,
        p_recruiting: formData.recruiting,
        p_license_type_ids: selectedLicenseIds,
        p_faction_id: formData.factionId || null,
    }
    )

    if (error) {
      setSubmitError(error.message)
      setIsSubmitting(false)
      return null
    }

    setIsSubmitting(false)
    return data
  }

  function clearSubmitError() {
    setSubmitError("")
  }

  return {
    licenseTypes,
    availableFactions,
    isLoading,
    isSubmitting,
    errorMessage,
    submitError,
    submitCompany,
    clearSubmitError,
  }
}

export default useCreateCompany