import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"

function LicensePage() {
  const { licenseSlug } = useParams()

  const [license, setLicense] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadLicense()
  }, [licenseSlug])

  async function loadLicense() {
    setIsLoading(true)
    setErrorMessage("")

    const normalizedSlug = licenseSlug?.trim().toLowerCase()

    if (!normalizedSlug) {
      setErrorMessage("No license identifier was provided.")
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("license_types")
      .select(`
        id,
        slug,
        name,
        short_name,
        classification,
        status,
        summary,
        description,
        services,
        permitted_activities,
        responsibilities,
        registry_notice
      `)
      .eq("slug", normalizedSlug)
      .maybeSingle()

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setLicense(data ?? null)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-4xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading License Registry
            </p>
          </Card>
        </div>
      </main>
    )
  }

  if (!license) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-4xl">
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
              Registry Error
            </p>

            <h1 className="mt-3 text-4xl font-bold uppercase tracking-wider">
              License Not Found
            </h1>

            <p className="mt-5 max-w-2xl leading-7 text-[#737373]">
              {errorMessage ||
                "The requested industrial license could not be located in the Volsung Origins Registry."}
            </p>

            <Link to="/licenses" className="mt-8 inline-block">
              <Button>Return to Licenses</Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }

  const services = license.services ?? []
  const permittedActivities = license.permitted_activities ?? []
  const responsibilities = license.responsibilities ?? []

  return (
    <main className="min-h-screen bg-[#171B1F] text-[#D9D9D9]">
      <section className="border-b border-[#384A59] bg-[#1D2328] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/licenses"
            className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E] transition hover:text-[#D9D9D9]"
          >
            ← Return to License Directory
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
                Industrial License
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <h1 className="text-5xl font-bold uppercase tracking-wider sm:text-6xl">
                  {license.name}
                </h1>

                <Badge variant="gold">{license.short_name}</Badge>
              </div>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#737373]">
                {license.summary}
              </p>
            </div>

            <div className="border border-[#384A59] bg-[#171B1F] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                Registry Classification
              </p>

              <p className="mt-3 text-xl font-bold uppercase tracking-wider">
                {license.classification}
              </p>

              <div className="mt-6 border-t border-[#384A59] pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                  License Status
                </p>

                <div className="mt-3">
                  <Badge
                    variant={
                      license.status === "active" ? "success" : "danger"
                    }
                  >
                    {license.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 border-t border-[#384A59] pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                  Registry Code
                </p>

                <p className="mt-3 font-mono text-sm uppercase tracking-widest text-[#D9D9D9]">
                  VO-LIC-{String(license.id).padStart(3, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <Card title="License Overview" subtitle="Operational definition">
            <p className="leading-7 text-[#737373]">
              {license.description}
            </p>
          </Card>

          <Card
            title="Available Services"
            subtitle="Commonly offered work and support"
          >
            {services.length > 0 ? (
              <ul className="space-y-4">
                {services.map((service) => (
                  <li
                    key={service}
                    className="flex gap-3 border-b border-[#384A59] pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="font-bold text-[#99692E]">+</span>

                    <span className="leading-7 text-[#D9D9D9]">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#737373]">
                No services are currently listed for this license.
              </p>
            )}
          </Card>

          <Card
            title="Permitted Activities"
            subtitle="Authorized industrial operations"
          >
            {permittedActivities.length > 0 ? (
              <ul className="space-y-4">
                {permittedActivities.map((activity) => (
                  <li
                    key={activity}
                    className="flex gap-3 border-b border-[#384A59] pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="font-bold text-[#99692E]">+</span>

                    <span className="leading-7 text-[#D9D9D9]">
                      {activity}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#737373]">
                No permitted activities are currently listed.
              </p>
            )}
          </Card>

          <Card
            title="License Responsibilities"
            subtitle="Required operational standards"
          >
            {responsibilities.length > 0 ? (
              <ul className="space-y-4">
                {responsibilities.map((responsibility) => (
                  <li
                    key={responsibility}
                    className="flex gap-3 border-b border-[#384A59] pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="font-bold text-[#99692E]">+</span>

                    <span className="leading-7 text-[#D9D9D9]">
                      {responsibility}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#737373]">
                No responsibilities are currently listed.
              </p>
            )}
          </Card>

          <div className="lg:col-span-2">
            <Card
              title="Registry Notice"
              subtitle="Administrative guidance"
            >
              <p className="leading-7 text-[#737373]">
                {license.registry_notice ||
                  "No additional registry guidance is currently listed."}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/factions">
                  <Button variant="outline">
                    Browse Registered Factions
                  </Button>
                </Link>

                <Link to="/licenses">
                  <Button variant="secondary">
                    View All Licenses
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LicensePage