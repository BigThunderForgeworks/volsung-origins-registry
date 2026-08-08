import { useEffect, useState } from "react"
import Card from "../../components/ui/Card"
import CompanyCard from "./components/CompanyCard"
import { supabase } from "../../lib/supabase"

function CompanyDirectoryPage() {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadCompanies()
  }, [])

  async function loadCompanies() {
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
        motto,
        status,
        recruiting,
        factions (
          id,
          name,
          short_name
        ),
        company_memberships (
          id,
          status
        ),
        company_licenses (
          id,
          status,
          license_types (
            id,
            name,
            short_name
          )
        )
      `)
      .eq("status", "active")
      .order("name", { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setCompanies([])
      setIsLoading(false)
      return
    }

    setCompanies(data ?? [])
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
        <div className="mx-auto max-w-6xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Company Registry
            </p>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 border-b border-[#384A59] pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Volsung Origins
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
            Company Registry
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-[#737373]">
            Registered commercial organizations operating throughout the
            system. Companies may operate independently or beneath a larger
            Faction umbrella.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
            {errorMessage}
          </div>
        )}

        {!errorMessage && companies.length === 0 ? (
          <Card>
            <p className="text-center leading-7 text-[#737373]">
              No active companies are currently registered.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default CompanyDirectoryPage