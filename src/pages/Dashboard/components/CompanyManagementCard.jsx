import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function CompanyManagementCard() {
  const [company, setCompany] = useState(null)
  const [memberships, setMemberships] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState(null)

  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadCompanyMembers()
  }, [])

  async function loadCompanyMembers() {
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
      setMemberships([])
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
        profiles (
          id,
          character_name,
          discord_username
        )
      `)
      .eq("company_id", companyRecord.id)
      .eq("status", "approved")

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    const nonOwners =
      data?.filter(
        (membership) =>
          membership.member_role !== "owner"
      ) ?? []

    setMemberships(nonOwners)
    setIsLoading(false)
  }

  async function handleRemoveMember(membership) {
    const memberName =
      membership.profiles?.character_name ??
      "this member"

    const confirmed = window.confirm(
      `Remove ${memberName} from ${company.name}?`
    )

    if (!confirmed) {
      return
    }

    setReviewingId(membership.id)
    setErrorMessage("")

    const { error } = await supabase.rpc(
      "remove_company_member",
      {
        p_membership_id: membership.id,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setReviewingId(null)
      return
    }

    await loadCompanyMembers()
    setReviewingId(null)
  }

  if (isLoading || !company) {
    return null
  }

  if (
    memberships.length === 0 &&
    !errorMessage
  ) {
    return null
  }

  return (
    <Card
      title="Company Personnel Management"
      subtitle={`${company.name} [${company.short_name}]`}
    >
      {errorMessage && (
        <div className="mb-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}

      {memberships.length > 0 && (
        <div className="space-y-4">
          {memberships.map((membership) => {
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

                <Button
                  variant="outline"
                  disabled={
                    reviewingId === membership.id
                  }
                  onClick={() =>
                    handleRemoveMember(membership)
                  }
                >
                  {reviewingId === membership.id
                    ? "Removing..."
                    : "Remove Member"}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default CompanyManagementCard