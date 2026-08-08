import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

function useOrganizationMigration() {
  const [user, setUser] = useState(null)
  const [faction, setFaction] = useState(null)
  const [migrationRecord, setMigrationRecord] = useState(null)
  const [availableFactions, setAvailableFactions] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    loadMigrationContext()
  }, [])

  async function loadMigrationContext() {
    setIsLoading(true)
    setErrorMessage("")

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !currentUser) {
      setErrorMessage(
        userError?.message ??
          "You must be signed in to access organization migration."
      )
      setIsLoading(false)
      return
    }

    setUser(currentUser)

    const { data: factionRecord, error: factionError } =
      await supabase
        .from("factions")
        .select(`
          id,
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
          status
        `)
        .eq("owner_id", currentUser.id)
        .maybeSingle()

    if (factionError) {
      setErrorMessage(factionError.message)
      setIsLoading(false)
      return
    }

    if (!factionRecord) {
      setFaction(null)
      setMigrationRecord(null)
      setAvailableFactions([])
      setIsLoading(false)
      return
    }

    setFaction(factionRecord)

    const { data: migration, error: migrationError } =
      await supabase
        .from("organization_migrations")
        .select(`
          id,
          faction_id,
          migration_type,
          company_id,
          target_faction_id,
          status,
          completed_at,
          created_at
        `)
        .eq("faction_id", factionRecord.id)
        .maybeSingle()

    if (migrationError) {
      setErrorMessage(migrationError.message)
      setIsLoading(false)
      return
    }

    setMigrationRecord(migration ?? null)

    const { data: factionOptions, error: factionOptionsError } =
      await supabase
        .from("factions")
        .select(`
          id,
          name,
          short_name
        `)
        .eq("status", "active")
        .neq("id", factionRecord.id)
        .order("name", { ascending: true })

    if (factionOptionsError) {
      setErrorMessage(factionOptionsError.message)
      setIsLoading(false)
      return
    }

    setAvailableFactions(factionOptions ?? [])
    setIsLoading(false)
  }

  async function submitMigration({
    migrationType,
    companyData,
    selectedFactionId,
  }) {
    setSubmitError("")

    if (!faction) {
      setSubmitError("No eligible faction was found.")
      return false
    }

    if (!migrationType) {
      setSubmitError("Select a migration option.")
      return false
    }

    if (migrationType === "faction_and_separate_company") {
      if (!companyData.name.trim()) {
        setSubmitError("Enter the new company name.")
        return false
      }

      if (
        !companyData.shortName.trim() ||
        companyData.shortName.trim().length < 2
      ) {
        setSubmitError(
          "Company tag must contain two or three letters."
        )
        return false
      }
    }

    if (
      migrationType === "company_under_faction" &&
      !selectedFactionId
    ) {
      setSubmitError("Select the target faction.")
      return false
    }

    setIsSubmitting(true)

    const { error } = await supabase.rpc(
      "migrate_existing_organization",
      {
        p_faction_id: faction.id,
        p_migration_type: migrationType,

        p_company_name:
          migrationType === "faction_and_separate_company"
            ? companyData.name.trim()
            : null,

        p_company_short_name:
          migrationType === "faction_and_separate_company"
            ? companyData.shortName.trim().toUpperCase()
            : null,

        p_company_description: null,
        p_company_logo_url: null,
        p_company_founded_date: null,
        p_company_motto: null,
        p_company_primary_color: null,
        p_company_secondary_color: null,

        p_target_faction_id:
          migrationType === "company_under_faction"
            ? selectedFactionId
            : null,
      }
    )

    if (error) {
      setSubmitError(error.message)
      setIsSubmitting(false)
      return false
    }

    await loadMigrationContext()

    setIsSubmitting(false)
    return true
  }

  function clearSubmitError() {
    setSubmitError("")
  }

  return {
    user,
    faction,
    migrationRecord,
    availableFactions,
    isLoading,
    isSubmitting,
    errorMessage,
    submitError,
    submitMigration,
    clearSubmitError,
    reload: loadMigrationContext,
  }
}

export default useOrganizationMigration