import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function CompanyMembershipRequestsCard() {
  const [company, setCompany] = useState(null)
  const [requests, setRequests] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isReviewing, setIsReviewing] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    setIsLoading(true)
    setErrorMessage("")

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      setErrorMessage(userError.message)
      setIsLoading(false)
      return
    }

    if (!user) {
      setIsLoading(false)
      return
    }

    const { data: companyRecord, error: companyError } =
      await supabase
        .from("companies")
        .select(`
          id,
          name,
          short_name
        `)
        .eq("owner_id", user.id)
        .eq("status", "active")
        .maybeSingle()

    if (companyError) {
      setErrorMessage(companyError.message)
      setIsLoading(false)
      return
    }

    if (!companyRecord) {
      setCompany(null)
      setRequests([])
      setIsLoading(false)
      return
    }

    setCompany(companyRecord)

    const { data, error } = await supabase
      .from("company_memberships")
      .select(`
        id,
        profile_id,
        member_role,
        status,
        created_at,
        profiles (
          id,
          character_name,
          discord_username
        )
      `)
      .eq("company_id", companyRecord.id)
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

  async function reviewRequest(membershipId, decision) {
    setIsReviewing(true)
    setErrorMessage("")

    const { error } = await supabase.rpc(
      "review_company_membership",
      {
        p_membership_id: membershipId,
        p_decision: decision,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setIsReviewing(false)
      return
    }

    await loadRequests()
    setIsReviewing(false)
  }

  if (isLoading || !company) {
    return null
  }

  if (requests.length === 0 && !errorMessage) {
    return null
  }

  return (
    <Card
      title="Pending Company Membership Requests"
      subtitle={`${company.name} [${company.short_name}]`}
    >
      {errorMessage && (
        <div className="mb-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}

      {requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((request) => {
            const profile = request.profiles

            return (
              <div
                key={request.id}
                className="flex flex-col gap-4 border border-[#384A59] bg-[#111519] p-5 sm:flex-row sm:items-center sm:justify-between"
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
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={isReviewing}
                    onClick={() =>
                      reviewRequest(
                        request.id,
                        "approved"
                      )
                    }
                  >
                    Approve
                  </Button>

                  <Button
                    variant="outline"
                    disabled={isReviewing}
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

export default CompanyMembershipRequestsCard