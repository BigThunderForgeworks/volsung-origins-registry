import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function OrganizationMigrationNotice({
  factionId,
  isFactionOwner,
}) {
  const navigate = useNavigate()

  const [migrationRecord, setMigrationRecord] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadMigrationStatus()
  }, [factionId, isFactionOwner])

  async function loadMigrationStatus() {
    if (!factionId || !isFactionOwner) {
      setMigrationRecord(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase
      .from("organization_migrations")
      .select(`
        id,
        migration_type,
        status,
        completed_at
      `)
      .eq("faction_id", factionId)
      .maybeSingle()

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setMigrationRecord(data ?? null)
    setIsLoading(false)
  }

  if (!isFactionOwner || !factionId || isLoading) {
    return null
  }

  if (errorMessage) {
    return null
  }

  if (migrationRecord) {
    return (
      <Card
        title="V3 Organization Structure"
        subtitle="Migration recorded"
      >
        <p className="leading-7 text-[#737373]">
          Your organization structure has already been recorded for the V3
          Company and Faction system.
        </p>

        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
          Status: {migrationRecord.status}
        </p>
      </Card>
    )
  }

  return (
    <Card
      title="V3 Organization Migration Available"
      subtitle="Company and Faction restructuring"
    >
      <p className="leading-7 text-[#737373]">
        Your organization is eligible to define its structure for the new
        Company and Faction system.
      </p>

      <p className="mt-4 leading-7 text-[#737373]">
        Choose whether your current organization remains a Faction, becomes a
        Company, or operates as both.
      </p>

      <Button
        className="mt-6"
        onClick={() => navigate("/organization-migration")}
      >
        Begin Migration
      </Button>
    </Card>
  )
}

export default OrganizationMigrationNotice