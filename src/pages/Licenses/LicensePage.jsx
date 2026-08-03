import { Link, useParams } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { getLicenseBySlug } from "../../data/licenses"

function LicensePage() {
  const { licenseSlug } = useParams()
  const license = getLicenseBySlug(licenseSlug)

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
              The requested industrial license could not be located in the
              Volsung Origins Registry.
            </p>

            <Link to="/" className="mt-8 inline-block">
              <Button>Return to Registry</Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#171B1F] text-[#D9D9D9]">
      <section className="border-b border-[#384A59] bg-[#1D2328] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/"
            className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E] transition hover:text-[#D9D9D9]"
          >
            ← Return to Industrial Registry
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

                <Badge variant="gold">{license.shortName}</Badge>
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
                  <Badge variant="success">{license.status}</Badge>
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
            <ul className="space-y-4">
              {license.services.map((service) => (
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
          </Card>

          <Card
            title="Permitted Activities"
            subtitle="Authorized industrial operations"
          >
            <ul className="space-y-4">
              {license.permittedActivities.map((activity) => (
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
          </Card>

          <Card
            title="License Responsibilities"
            subtitle="Required operational standards"
          >
            <ul className="space-y-4">
              {license.responsibilities.map((responsibility) => (
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
          </Card>

          <div className="lg:col-span-2">
            <Card
              title="Registry Notice"
              subtitle="Administrative guidance"
            >
              <p className="leading-7 text-[#737373]">
                {license.registryNotice}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/factions">
                  <Button variant="outline">
                    Browse Registered Factions
                  </Button>
                </Link>

                <Link to="/">
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