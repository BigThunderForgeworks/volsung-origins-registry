import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function RegisteredCompaniesCard({ onNavigate }) {
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
        name,
        short_name,
        owner_id,
        recruiting,
        status,
        created_at,
        factions (
          id,
          name,
          short_name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setCompanies(data ?? [])
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <Card
        title="Registered Companies"
        subtitle="Loading company registry"
      />
    )
  }

  return (
    <Card
      title="Registered Companies"
      subtitle="Corporate registry administration"
    >
      {errorMessage && (
        <div className="mb-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}

      {companies.length === 0 ? (
        <p className="leading-7 text-[#737373]">
          No Companies are currently registered.
        </p>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex flex-col gap-4 border border-[#384A59] bg-[#111519] p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-bold uppercase tracking-wider">
                  {company.name}
                </p>

                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
                  [{company.short_name}]
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.15em] text-[#737373]">
                  <span>
                    Status: {company.status}
                  </span>

                  <span>
                    Recruitment:{" "}
                    {company.recruiting
                      ? "Open"
                      : "Closed"}
                  </span>

                  <span>
                    Faction:{" "}
                    {company.factions
                      ? `${company.factions.name} [${company.factions.short_name}]`
                      : "Independent"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    onNavigate(
                      `/companies/${company.short_name}`
                    )
                  }
                >
                  View Company
                </Button>

                <Button
                  onClick={() =>
                    onNavigate(
                      `/companies/${company.short_name}/manage`
                    )
                  }
                >
                  Manage Company
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default RegisteredCompaniesCard