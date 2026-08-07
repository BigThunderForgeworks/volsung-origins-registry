import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"

function FactionPage() {
  const [factions, setFactions] = useState([])
  const [licenseTypes, setLicenseTypes] = useState([])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLicenseId, setSelectedLicenseId] = useState("")
  const [recruitingOnly, setRecruitingOnly] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadDirectory()
  }, [])

  async function loadDirectory() {
    setIsLoading(true)
    setErrorMessage("")

    const [
      { data: factionRecords, error: factionError },
      { data: membershipRecords, error: membershipError },
      { data: factionLicenseRecords, error: factionLicenseError },
      { data: licenseTypeRecords, error: licenseTypeError },
    ] = await Promise.all([
      supabase
        .from("factions")
        .select(`
          id,
          name,
          short_name,
          description,
          founder_name,
          logo_url,
          recruiting,
          status,
          created_at
        `)
        .eq("status", "active")
        .order("name"),

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
          id,
          faction_id,
          license_type_id,
          status,
          license_types (
            id,
            name,
            short_name,
            slug
          )
        `)
        .eq("status", "active"),

      supabase
        .from("license_types")
        .select(`
          id,
          name,
          short_name
        `)
        .eq("status", "active")
        .order("name"),
    ])

    const firstError =
      factionError ||
      membershipError ||
      factionLicenseError ||
      licenseTypeError

    if (firstError) {
      setErrorMessage(firstError.message)
      setIsLoading(false)
      return
    }

    const formattedFactions = (factionRecords ?? []).map((faction) => {
      const memberCount = (membershipRecords ?? []).filter(
        (membership) => membership.faction_id === faction.id
      ).length

      const licenses = (factionLicenseRecords ?? []).filter(
        (license) => license.faction_id === faction.id
      )

      return {
        ...faction,
        memberCount,
        licenses,
      }
    })

    setFactions(formattedFactions)
    setLicenseTypes(licenseTypeRecords ?? [])
    setIsLoading(false)
  }

  const filteredFactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return factions.filter((faction) => {
      const matchesSearch =
        !normalizedSearch ||
        faction.name.toLowerCase().includes(normalizedSearch) ||
        faction.short_name.toLowerCase().includes(normalizedSearch) ||
        faction.founder_name?.toLowerCase().includes(normalizedSearch)

      const matchesRecruiting =
        !recruitingOnly || faction.recruiting

      const matchesLicense =
        !selectedLicenseId ||
        faction.licenses.some(
          (license) => license.license_type_id === selectedLicenseId
        )

      return (
        matchesSearch &&
        matchesRecruiting &&
        matchesLicense
      )
    })
  }, [
    factions,
    recruitingOnly,
    searchTerm,
    selectedLicenseId,
  ])

  return (
    <section className="bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-[#384A59] pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Public Directory
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
            Factions
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-[#737373]">
            Browse active factions, review their licenses, and find groups
            currently accepting new members.
          </p>
        </div>

        <Card
          title="Directory Filters"
          subtitle="Search the registry"
          className="mt-8"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_280px_auto] lg:items-end">
            <div>
              <label
                htmlFor="faction-search"
                className="text-xs font-bold uppercase tracking-[0.25em]"
              >
                Search
              </label>

              <input
                id="faction-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by faction name, tag, or founder"
                className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 outline-none transition placeholder:text-[#737373] focus:border-[#99692E]"
              />
            </div>

            <div>
              <label
                htmlFor="license-filter"
                className="text-xs font-bold uppercase tracking-[0.25em]"
              >
                License
              </label>

              <select
                id="license-filter"
                value={selectedLicenseId}
                onChange={(event) =>
                  setSelectedLicenseId(event.target.value)
                }
                className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 outline-none transition focus:border-[#99692E]"
              >
                <option value="">All Licenses</option>

                {licenseTypes.map((license) => (
                  <option key={license.id} value={license.id}>
                    {license.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-3 border border-[#384A59] bg-[#111519] px-4 py-3">
              <input
                type="checkbox"
                checked={recruitingOnly}
                onChange={(event) =>
                  setRecruitingOnly(event.target.checked)
                }
                className="h-4 w-4 accent-[#99692E]"
              />

              <span className="text-sm font-bold uppercase tracking-wider">
                Recruiting Only
              </span>
            </label>
          </div>
        </Card>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-widest text-[#737373]">
            {isLoading
              ? "Loading Registry"
              : `${filteredFactions.length} Faction${
                  filteredFactions.length === 1 ? "" : "s"
                } Found`}
          </p>

          {(searchTerm || selectedLicenseId || recruitingOnly) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedLicenseId("")
                setRecruitingOnly(false)
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="mt-8 flex min-h-56 items-center justify-center border border-[#384A59] bg-[#1D2328]">
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Faction Directory
            </p>
          </div>
        ) : filteredFactions.length === 0 ? (
          <div className="mt-8 flex min-h-56 items-center justify-center border border-dashed border-[#384A59] bg-[#1D2328] px-6 text-center">
            <div>
              <p className="text-xl font-bold uppercase tracking-wider">
                No Matching Factions
              </p>

              <p className="mt-2 text-[#737373]">
                Adjust the search or filter options and try again.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFactions.map((faction) => (
              <Card key={faction.id}>
                <div className="flex items-start gap-4">
                  {faction.logo_url ? (
                    <img
                      src={faction.logo_url}
                      alt={`${faction.name} logo`}
                      className="h-20 w-20 shrink-0 border border-[#384A59] object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-[#384A59] bg-[#111519] px-2 text-center text-xs uppercase text-[#737373]">
                      No Logo
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="gold">
                        {faction.short_name}
                      </Badge>

                      <Badge
                        variant={
                          faction.recruiting ? "success" : "danger"
                        }
                      >
                        {faction.recruiting
                          ? "Recruiting"
                          : "Closed"}
                      </Badge>
                    </div>

                    <h2 className="mt-4 text-xl font-bold uppercase tracking-wider">
                      {faction.name}
                    </h2>

                    <p className="mt-2 text-sm text-[#737373]">
                      Founder: {faction.founder_name || "Unknown"}
                    </p>
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 leading-7 text-[#737373]">
                  {faction.description}
                </p>

                <div className="mt-6 border-t border-[#384A59] pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#737373]">
                      Registered Members
                    </span>

                    <span className="text-2xl font-bold">
                      {faction.memberCount}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
                      Licenses
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {faction.licenses.length > 0 ? (
                        faction.licenses.map((license) => (
                          <Badge
                            key={license.id}
                            variant={
                              license.status === "active"
                                ? "success"
                                : license.status === "rejected"
                                  ? "danger"
                                  : "gold"
                            }
                          >
                            {license.license_types?.short_name ??
                              license.license_types?.name ??
                              "Unknown"}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-[#737373]">
                          No licenses listed.
                        </span>
                      )}
                    </div>
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
            ))}
          </div>
        )}

        {errorMessage && (
          <div className="mt-8 border border-red-700 bg-red-900/20 px-5 py-4 text-sm text-red-400">
            Failed to load faction directory: {errorMessage}
          </div>
        )}
      </div>
    </section>
  )
}

export default FactionPage