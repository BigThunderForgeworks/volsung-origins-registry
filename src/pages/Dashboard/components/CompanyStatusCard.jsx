import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function CompanyStatusCard() {
  const navigate = useNavigate()

  const [membership, setMembership] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadCompanyStatus()
  }, [])

  async function loadCompanyStatus() {
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

    const { data, error } = await supabase
      .from("company_memberships")
      .select(`
        id,
        member_role,
        status,
        companies (
          id,
          name,
          short_name,
          recruiting,
          factions (
            id,
            name,
            short_name
          )
        )
      `)
      .eq("profile_id", user.id)
      .in("status", ["pending", "approved"])
      .maybeSingle()

    if (error) {
      console.error("Company status error:", error)
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setMembership(data ?? null)
    setIsLoading(false)
  }

  if (isLoading) {
    return null
  }

  if (errorMessage) {
    return (
      <Card
        title="Company Status"
        subtitle="Unable to load company"
      >
        <p className="text-red-400">
          {errorMessage}
        </p>
      </Card>
    )
  }

  if (!membership) {
    return (
      <Card
        title="Company Status"
        subtitle="No registered company"
      >
        <p className="leading-7 text-[#737373]">
          You are not currently registered with a Company.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => navigate("/companies/create")}
          >
            Create Company
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/companies")}
          >
            Browse Companies
          </Button>
        </div>
      </Card>
    )
  }

  const company = membership.companies

  return (
    <Card
      title="Company Status"
      subtitle={
        membership.status === "approved"
          ? "Active Company Membership"
          : "Membership Pending"
      }
    >
      <p className="text-xl font-bold uppercase tracking-wider">
        {company?.name}
      </p>

      <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
        [{company?.short_name}]
      </p>

      {company?.factions && (
        <p className="mt-4 text-sm text-[#737373]">
          Faction: {company.factions.name} [{company.factions.short_name}]
        </p>
      )}

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
        Role: {membership.member_role}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() =>
            navigate(`/companies/${company.short_name}`)
          }
        >
          View Company
        </Button>

        {membership.member_role === "owner" && (
          <Button
            onClick={() =>
              navigate(`/companies/${company.short_name}/manage`)
            }
          >
            Manage Company
          </Button>
        )}
      </div>
    </Card>
  )
}

export default CompanyStatusCard