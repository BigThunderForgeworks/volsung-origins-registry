import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"
import CompanyHeader from "./components/CompanyHeader"
import CompanyLicenseList from "./components/CompanyLicenseList"
import CompanyPersonnelList from "./components/CompanyPersonnelList"
import CompanyJoinCard from "./components/CompanyJoinCard"

function CompanyPage() {
  const navigate = useNavigate()
  const { companyTag } = useParams()

  const [company, setCompany] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadCompany()
  }, [companyTag])

  async function loadCompany() {
    setIsLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase
      .from("companies")
      .select(`
        id,
        faction_id,
        name,
        short_name,
        description,
        logo_url,
        founder_name,
        founded_date,
        motto,
        primary_color,
        secondary_color,
        recruiting,
        status,
        factions (
          id,
          name,
          short_name
        ),
        company_licenses (
        id,
        status,
        license_types (
            id,
            name,
            short_name,
            classification,
            summary
            )
            ),
        company_memberships (
          id,
          member_role,
          status,
          profiles (
            id,
            character_name,
            discord_username))
      `)
      .eq("short_name", companyTag?.toUpperCase())
      .eq("status", "active")
      .maybeSingle()

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setCompany(data ?? null)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Company Registry
            </p>
          </Card>
        </div>
      </main>
    )
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card>
            <div className="border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
              {errorMessage}
            </div>

            <Button
              className="mt-6"
              variant="outline"
              onClick={() => navigate("/companies")}
            >
              Return to Company Registry
            </Button>
          </Card>
        </div>
      </main>
    )
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card
            title="Company Not Found"
            subtitle="Registry record unavailable"
          >
            <p className="leading-7 text-[#737373]">
              No active company could be found with this registry tag.
            </p>

            <Button
              className="mt-6"
              variant="outline"
              onClick={() => navigate("/companies")}
            >
              Return to Company Registry
            </Button>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <article className="mx-auto max-w-5xl">
        <Button
          variant="outline"
          onClick={() => navigate("/companies")}
        >
          Return to Company Registry
        </Button>

        <div className="mt-8">
          <CompanyHeader company={company} />
        </div>

        <div className="mt-8">
          <CompanyJoinCard company={company} />
        </div>

        <div className="mt-8">
            <CompanyLicenseList
                licenses={company.company_licenses ?? []}
            />
        </div>

        <div className="mt-8">
          <CompanyPersonnelList
            memberships={company.company_memberships ?? []}
          />
        </div>
      </article>
    </main>
  )
}

export default CompanyPage