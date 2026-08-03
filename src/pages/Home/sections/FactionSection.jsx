import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function FactionSection() {
  const [factions, setFactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadFactions()
  }, [])

  async function loadFactions() {
    setIsLoading(true)
    setErrorMessage("")

    const [
      { data: factionRecords, error: factionError },
      { data: membershipRecords, error: membershipError },
      { data: licenseRecords, error: licenseError },
    ] = await Promise.all([
      supabase
        .from("factions")
        .select(`
          id,
          name,
          short_name,
          recruiting,
          logo_url,
          created_at
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6),

      supabase
        .from("faction_memberships")
        .select(`
          faction_id,
          status
        `)
        .eq("status", "approved"),

      supabase
        .from("faction_licenses")
        .select(`
          faction_id,
          status,
          license_types (
            name,
            short_name
          )
        `),
    ])

    const firstError =
      factionError ||
      membershipError ||
      licenseError

    if (firstError) {
      setErrorMessage(firstError.message)
      setIsLoading(false)
      return
    }

    const formattedFactions = (factionRecords ?? []).map((faction) => {
      const memberCount = (membershipRecords ?? []).filter(
        (membership) => membership.faction_id === faction.id
      ).length

      const assignedLicenses = (licenseRecords ?? []).filter(
        (license) => license.faction_id === faction.id
      )

      return {
        ...faction,
        members: memberCount,
        licenses: assignedLicenses,
      }
    })

    setFactions(formattedFactions)
    setIsLoading(false)
  }

  return (
    <section className="border-b border-[#384A59] bg-[#171B1F] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#384A59] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
              Public Directory
            </p>

            <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider">
              Registered Factions
            </h2>
          </div>

          <p className="text-sm uppercase tracking-widest text-[#737373]">
            {isLoading ? "Loading Registry" : `${factions.length} Factions Shown`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center border border-[#384A59] bg-[#1D2328]">
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Registered Factions
            </p>
          </div>
        ) : factions.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center border border-dashed border-[#384A59] bg-[#1D2328] px-6 text-center">
            <div>
              <p className="text-xl font-bold uppercase tracking-wider">
                No Registered Factions
              </p>

              <p className="mt-2 text-[#737373]">
                Newly registered factions will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {factions.map((faction) => {
              const firstLicense = faction.licenses[0]
              const additionalLicenseCount = Math.max(
                faction.licenses.length - 1,
                0
              )

              return (
                <Card key={faction.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      {faction.logo_url && (
                        <img
                          src={faction.logo_url}
                          alt={`${faction.name} logo`}
                          className="h-16 w-16 shrink-0 border border-[#384A59] object-cover"
                        />
                      )}

                      <div className="min-w-0">
                        <h3 className="text-2xl font-bold uppercase tracking-wider text-[#D9D9D9]">
                          {faction.name}
                        </h3>

                        {faction.short_name && (
                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                            {faction.short_name}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          {firstLicense ? (
                            <>
                              <Badge
                                variant={
                                  firstLicense.status === "active"
                                    ? "success"
                                    : "gold"
                                }
                              >
                                {firstLicense.license_types?.name ??
                                  "Unknown License"}
                              </Badge>

                              {additionalLicenseCount > 0 && (
                                <Badge>
                                  +{additionalLicenseCount} More
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge>No Licenses</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant={faction.recruiting ? "success" : "danger"}
                    >
                      {faction.recruiting ? "Recruiting" : "Closed"}
                    </Badge>
                  </div>

                  <div className="mt-6 border-t border-[#384A59] pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[#737373]">
                        Registered Members
                      </span>

                      <span className="text-2xl font-bold text-[#D9D9D9]">
                        {faction.members}
                      </span>
                    </div>

                    <Link
                      to={`/factions/${faction.short_name}`}
                      className="mt-6 block"
                    >
                      <Button variant="outline" className="w-full">
                        View Registry
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 border border-red-700 bg-red-900/20 px-5 py-4 text-sm text-red-400">
            Failed to load registered factions: {errorMessage}
          </div>
        )}
      </div>
    </section>
  )
}

export default FactionSection