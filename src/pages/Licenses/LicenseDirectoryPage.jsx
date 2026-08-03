import { Link } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import licenses from "../../data/licenses"

function LicenseDirectoryPage() {
  return (
    <main className="min-h-screen bg-[#171B1F] text-[#D9D9D9]">
      <section className="border-b border-[#384A59] bg-[#1D2328] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Volsung Industries
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider sm:text-6xl">
            License Registry
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#737373]">
            Review the recognized industrial licenses available throughout
            Volsung Origins. Each license defines the services an operator may
            provide, the activities they may perform, and the responsibilities
            they accept within the registry.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Badge variant="success">Registry Online</Badge>
            <Badge variant="gold">{licenses.length} Active Licenses</Badge>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 border-b border-[#384A59] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
                Public Directory
              </p>

              <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider">
                Available Licenses
              </h2>
            </div>

            <p className="text-sm uppercase tracking-widest text-[#737373]">
              Select a registry record
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {licenses.map((license) => (
              <Link
                key={license.id}
                to={`/licenses/${license.slug}`}
                className="group flex h-full flex-col border border-[#384A59] bg-[#1D2328] p-6 transition hover:-translate-y-1 hover:border-[#99692E] hover:bg-[#22282D]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#737373]">
                      VO-LIC-{String(license.id).padStart(3, "0")}
                    </p>

                    <h3 className="mt-3 text-2xl font-bold uppercase tracking-wider text-[#D9D9D9]">
                      {license.name}
                    </h3>
                  </div>

                  <Badge variant="gold">{license.shortName}</Badge>
                </div>

                <p className="mt-5 flex-1 text-sm leading-7 text-[#737373]">
                  {license.summary}
                </p>

                <div className="mt-6 border-t border-[#384A59] pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
                    Classification
                  </p>

                  <p className="mt-2 text-sm uppercase tracking-wider text-[#D9D9D9]">
                    {license.classification}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#384A59] pt-4">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                    Open Registry Record
                  </span>

                  <span className="text-lg text-[#99692E] transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-xs uppercase tracking-widest text-[#737373]">
            License definitions and operating requirements remain subject to
            registry administration.
          </p>
        </div>
      </section>
    </main>
  )
}

export default LicenseDirectoryPage