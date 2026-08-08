import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function AdminCompanyMembershipRequests() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    setIsLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase
      .from("company_memberships")
      .select(`
        id,
        company_id,
        profile_id,
        member_role,
        status,
        created_at,
        companies (
          id,
          name,
          short_name
        ),
        profiles (
          id,
          character_name,
          discord_username
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setRequests(data ?? [])
    setIsLoading(false)
  }

  async function reviewRequest(requestId, decision) {
    setReviewingId(requestId)
    setErrorMessage("")

    const { error } = await supabase.rpc(
      "review_company_membership",
      {
        p_membership_id: requestId,
        p_decision: decision,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setReviewingId(null)
      return
    }

    await loadRequests()
    setReviewingId(null)
  }

  if (isLoading) {
    return (
      <Card
        title="Company Membership Requests"
        subtitle="Loading pending requests"
      />
    )
  }

  return (
    <Card
      title="Company Membership Requests"
      subtitle="Pending corporate membership approvals"
    >
      {errorMessage && (
        <div className="mb-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}

      {requests.length === 0 ? (
        <p className="leading-7 text-[#737373]">
          No pending Company membership requests.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const profile = request.profiles
            const company = request.companies

            return (
              <div
                key={request.id}
                className="flex flex-col gap-4 border border-[#384A59] bg-[#111519] p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="font-bold uppercase tracking-wider">
                    {profile?.character_name ?? "Unnamed Personnel"}
                  </p>

                  {profile?.discord_username && (
                    <p className="mt-1 text-sm text-[#737373]">
                      {profile.discord_username}
                    </p>
                  )}

                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                    Requested Company
                  </p>

                  <p className="mt-1 text-sm text-[#D9D9D9]">
                    {company?.name} [{company?.short_name}]
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={reviewingId === request.id}
                    onClick={() =>
                      reviewRequest(
                        request.id,
                        "approved"
                      )
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
                      reviewRequest(
                        request.id,
                        "rejected"
                      )
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

export default AdminCompanyMembershipRequests