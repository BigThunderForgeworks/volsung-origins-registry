import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Badge from "../../../components/ui/Badge"
import { supabase } from "../../../lib/supabase"

function IndustrySection() {
  const [licenses, setLicenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadLicenses()
  }, [])

  async function loadLicenses() {
    setIsLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase
      .from("license_types")
      .select(`
        id,
        slug,
        name,
        short_name,
        summary,
        classification,
        status
      `)
      .eq("status", "active")
      .order("name")

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setLicenses(data ?? [])
    setIsLoading(false)
  }

  return (
    <section className="border-b border-[#384A59] bg-[#1D2328] px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
          Industrial Sectors
        </p>

        <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider text-[#D9D9D9]">
          Available License Types
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-[#737373]">
          Every registered operator works under one or more industrial
          licenses. Select a license below to review its authorized services,
          operational responsibilities, and registry guidance.
        </p>

        {isLoading ? (
          <div className="mt-10 flex min-h-48 items-center justify-center border border-[#384A59] bg-[#171B1F]">
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading License Registry
            </p>
          </div>
        ) : licenses.length === 0 ? (
          <div className="mt-10 flex min-h-48 items-center justify-center border border-dashed border-[#384A59] bg-[#171B1F] px-6 text-center">
            <div>
              <p className="text-xl font-bold uppercase tracking-wider text-[#D9D9D9]">
                No Active Licenses
              </p>

              <p className="mt-2 text-[#737373]">
                Active license types will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {licenses.map((license, index) => (
              <Link
                key={license.id}
                to={`/licenses/${license.slug}`}
                className="group border border-[#384A59] bg-[#171B1F] p-5 transition hover:-translate-y-1 hover:border-[#99692E] hover:bg-[#22282D]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                      VO-LIC-{String(index + 1).padStart(3, "0")}
                    </p>

                    <h3 className="mt-3 text-xl font-bold uppercase tracking-wider text-[#D9D9D9]">
                      {license.name}
                    </h3>
                  </div>

                  <Badge variant="gold">{license.short_name}</Badge>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#737373]">
                  {license.summary}
                </p>

                <div className="mt-6 border-t border-[#384A59] pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
                    Classification
                  </p>

                  <p className="mt-2 text-sm uppercase tracking-wider text-[#D9D9D9]">
                    {license.classification}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#384A59] pt-4">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                    View License
                  </span>

                  <span className="text-lg text-[#99692E] transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 border border-red-700 bg-red-900/20 px-5 py-4 text-sm text-red-400">
            Failed to load license types: {errorMessage}
          </div>
        )}
      </div>
    </section>
  )
}

export default IndustrySection