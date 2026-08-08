import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function CompanyPersonnelManager({ company }) {
  const [memberships, setMemberships] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadMemberships()
  }, [company?.id])

  async function loadMemberships() {
    if (!company?.id) {
      return
    }

    setIsLoading(true)
    setErrorMessage("")

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
      .eq("company_id", company.id)
      .in("status", ["pending", "approved"])
      .order("created_at", { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setMemberships(data ?? [])
    setIsLoading(false)
  }

  async function handleReview(membershipId, decision) {
    setProcessingId(membershipId)
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
      setProcessingId(null)
      return
    }

    await loadMemberships()
    setProcessingId(null)
  }

  async function handleRemove(membership) {
    if (membership.member_role === "owner") {
      setErrorMessage(
        "Company owners cannot be removed until ownership is transferred."
      )
      return
    }

    const displayName =
      membership.profiles?.character_name ??
      membership.profiles?.discord_username ??
      "this member"

    const confirmed = window.confirm(
      `Remove ${displayName} from ${company.name}?`
    )

    if (!confirmed) {
      return
    }

    setProcessingId(membership.id)
    setErrorMessage("")

    const { error } = await supabase.rpc(
      "remove_company_member",
      {
        p_membership_id: membership.id,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setProcessingId(null)
      return
    }

    await loadMemberships()
    setProcessingId(null)
  }

  if (isLoading) {
    return (
      <Card
        title="Company Personnel"
        subtitle="Loading personnel"
      />
    )
  }

  const pendingRequests = memberships.filter(
    (membership) => membership.status === "pending"
  )

  const approvedMembers = memberships.filter(
    (membership) => membership.status === "approved"
  )

  return (
    <Card
      title="Company Personnel"
      subtitle="Membership and personnel management"
    >
      {errorMessage && (
        <div className="mb-6 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
          Pending Requests
        </p>

        {pendingRequests.length === 0 ? (
          <p className="mt-3 leading-7 text-[#737373]">
            No pending Company membership requests.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {pendingRequests.map((membership) => {
              const profile = membership.profiles

              return (
                <div
                  key={membership.id}
                  className="flex flex-col gap-4 border border-[#384A59] bg-[#111519] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold uppercase tracking-wider">
                      {profile?.character_name ??
                        "Unnamed Personnel"}
                    </p>

                    {profile?.discord_username && (
                      <p className="mt-1 text-sm text-[#737373]">
                        {profile.discord_username}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      disabled={
                        processingId === membership.id
                      }
                      onClick={() =>
                        handleReview(
                          membership.id,
                          "approved"
                        )
                      }
                    >
                      Approve
                    </Button>

                    <Button
                      variant="outline"
                      disabled={
                        processingId === membership.id
                      }
                      onClick={() =>
                        handleReview(
                          membership.id,
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
      </section>

      <section className="mt-8 border-t border-[#384A59] pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
          Approved Personnel
        </p>

        {approvedMembers.length === 0 ? (
          <p className="mt-3 leading-7 text-[#737373]">
            No approved Company personnel.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {approvedMembers.map((membership) => {
              const profile = membership.profiles

              return (
                <div
                  key={membership.id}
                  className="flex flex-col gap-4 border border-[#384A59] bg-[#111519] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold uppercase tracking-wider">
                      {profile?.character_name ??
                        "Unnamed Personnel"}
                    </p>

                    {profile?.discord_username && (
                      <p className="mt-1 text-sm text-[#737373]">
                        {profile.discord_username}
                      </p>
                    )}

                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                      {membership.member_role}
                    </p>
                  </div>

                  {membership.member_role !== "owner" && (
                    <Button
                      variant="outline"
                      disabled={
                        processingId === membership.id
                      }
                      onClick={() =>
                        handleRemove(membership)
                      }
                    >
                      Remove Member
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </Card>
  )
}

export default CompanyPersonnelManager