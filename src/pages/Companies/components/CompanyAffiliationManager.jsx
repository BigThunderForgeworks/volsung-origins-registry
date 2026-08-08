import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function CompanyAffiliationManager({
  company,
  affiliationRequests,
  onChanged,
}) {
  const [availableFactions, setAvailableFactions] = useState([])
  const [selectedFactionId, setSelectedFactionId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadFactions()
  }, [company?.id])

  async function loadFactions() {
    if (!company?.id) {
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase
      .from("factions")
      .select(`
        id,
        name,
        short_name,
        status
      `)
      .eq("status", "active")
      .order("name", { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    const filtered =
      data?.filter(
        (faction) => faction.id !== company.faction_id
      ) ?? []

    setAvailableFactions(filtered)
    setIsLoading(false)
  }

  async function requestAffiliation() {
    if (!selectedFactionId) {
      setErrorMessage("Select a Faction.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")
    setMessage("")

    const { error } = await supabase.rpc(
      "request_company_affiliation",
      {
        p_company_id: company.id,
        p_faction_id: selectedFactionId,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    setSelectedFactionId("")
    setMessage("Faction affiliation request submitted.")

    await onChanged()
    setIsSubmitting(false)
  }

  const pendingRequest = affiliationRequests.find(
    (request) => request.status === "pending"
  )

  const latestRequest = affiliationRequests[0] ?? null

  return (
    <Card
      title="Faction Affiliation"
      subtitle="Company umbrella relationship"
    >
      {errorMessage && (
        <div className="mb-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}

      {message && (
        <div className="mb-5 border border-green-700 bg-green-900/20 px-5 py-4 text-green-400">
          {message}
        </div>
      )}

      {company.factions ? (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
            Current Faction
          </p>

          <p className="mt-3 text-xl font-bold uppercase tracking-wider">
            {company.factions.name}
          </p>

          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
            [{company.factions.short_name}]
          </p>

          <p className="mt-5 leading-7 text-[#737373]">
            This Company currently operates beneath the registered Faction
            shown above.
          </p>
        </div>
      ) : pendingRequest ? (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
            Pending Affiliation Request
          </p>

          <p className="mt-3 text-xl font-bold uppercase tracking-wider">
            {pendingRequest.factions?.name ?? "Selected Faction"}
          </p>

          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
            [{pendingRequest.factions?.short_name ?? "N/A"}]
          </p>

          <p className="mt-5 leading-7 text-[#737373]">
            This request is awaiting review by the receiving Faction or an
            administrator.
          </p>
        </div>
      ) : (
        <div>
          <p className="leading-7 text-[#737373]">
            This Company currently operates independently. You may request
            affiliation beneath an active Faction.
          </p>

          {latestRequest && (
            <p className="mt-4 text-sm uppercase tracking-[0.15em] text-[#737373]">
              Previous request status: {latestRequest.status}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <select
              value={selectedFactionId}
              disabled={isLoading || isSubmitting}
              onChange={(event) => {
                setSelectedFactionId(event.target.value)
                setErrorMessage("")
                setMessage("")
              }}
              className="flex-1 border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
            >
              <option value="">
                Select Faction
              </option>

              {availableFactions.map((faction) => (
                <option
                  key={faction.id}
                  value={faction.id}
                >
                  {faction.name} [{faction.short_name}]
                </option>
              ))}
            </select>

            <Button
              disabled={
                isLoading ||
                isSubmitting ||
                !selectedFactionId
              }
              onClick={requestAffiliation}
            >
              {isSubmitting
                ? "Submitting..."
                : "Request Affiliation"}
            </Button>
          </div>

          {!isLoading &&
            availableFactions.length === 0 && (
              <p className="mt-4 text-sm text-[#737373]">
                No active Factions are currently available for affiliation.
              </p>
            )}
        </div>
      )}
    </Card>
  )
}

export default CompanyAffiliationManager