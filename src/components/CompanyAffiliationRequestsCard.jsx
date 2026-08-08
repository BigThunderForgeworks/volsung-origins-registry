import { useEffect, useState } from "react"
import Button from "./ui/Button"
import Card from "./ui/Card"
import { supabase } from "../lib/supabase"

function CompanyAffiliationRequestsCard({
  factionId = null,
  adminMode = false,
}) {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState(null)

  const [errorMessage, setErrorMessage] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadRequests()
  }, [factionId, adminMode])

  async function loadRequests() {
    setIsLoading(true)
    setErrorMessage("")

    let query = supabase
      .from("company_affiliation_requests")
      .select(`
        id,
        company_id,
        faction_id,
        status,
        created_at,

        companies (
          id,
          name,
          short_name,
          recruiting
        ),

        factions!company_affiliation_requests_faction_id_fkey (
          id,
          name,
          short_name
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: true })

    if (!adminMode) {
      if (!factionId) {
        setRequests([])
        setIsLoading(false)
        return
      }

      query = query.eq("faction_id", factionId)
    }

    const { data, error } = await query

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setRequests(data ?? [])
    setIsLoading(false)
  }

  async function handleReview(request, decision) {
    const companyName =
      request.companies?.name ?? "this Company"

    const factionName =
      request.factions?.name ?? "this Faction"

    const action =
      decision === "approved"
        ? "approve"
        : "reject"

    const confirmed = window.confirm(
      `${action === "approve" ? "Approve" : "Reject"} the affiliation request from ${companyName} to ${factionName}?`
    )

    if (!confirmed) {
      return
    }

    setReviewingId(request.id)
    setErrorMessage("")
    setMessage("")

    const { error } = await supabase.rpc(
      "review_company_affiliation",
      {
        p_request_id: request.id,
        p_decision: decision,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setReviewingId(null)
      return
    }

    setMessage(
      decision === "approved"
        ? `${companyName} is now affiliated with ${factionName}.`
        : `${companyName}'s affiliation request was rejected.`
    )

    await loadRequests()
    setReviewingId(null)
  }

  if (isLoading) {
    return (
      <Card
        title="Company Affiliation Requests"
        subtitle="Loading pending requests"
      />
    )
  }

  return (
    <Card
      title="Company Affiliation Requests"
      subtitle={
        adminMode
          ? "Pending Company to Faction affiliations"
          : "Companies requesting Faction affiliation"
      }
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

      {requests.length === 0 ? (
        <p className="leading-7 text-[#737373]">
          No pending Company affiliation requests.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const company = request.companies
            const faction = request.factions

            return (
              <div
                key={request.id}
                className="flex flex-col gap-5 border border-[#384A59] bg-[#111519] p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                    Requesting Company
                  </p>

                  <p className="mt-2 font-bold uppercase tracking-wider">
                    {company?.name ?? "Unknown Company"}
                  </p>

                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
                    [{company?.short_name ?? "N/A"}]
                  </p>

                  {adminMode && (
                    <>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                        Requested Faction
                      </p>

                      <p className="mt-2 text-sm text-[#D9D9D9]">
                        {faction?.name ?? "Unknown Faction"}{" "}
                        [{faction?.short_name ?? "N/A"}]
                      </p>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={reviewingId === request.id}
                    onClick={() =>
                      handleReview(request, "approved")
                    }
                  >
                    {reviewingId === request.id
                      ? "Processing..."
                      : "Approve"}
                  </Button>

                  <Button
                    variant="outline"
                    disabled={reviewingId === request.id}
                    onClick={() =>
                      handleReview(request, "rejected")
                    }
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default CompanyAffiliationRequestsCard