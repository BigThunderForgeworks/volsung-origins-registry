import { Link } from "react-router-dom"
import Badge from "../../../components/ui/Badge"
import licenses from "../../../data/licenses"

function IndustrySection() {
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {licenses.map((license) => (
            <Link
              key={license.id}
              to={`/licenses/${license.slug}`}
              className="group border border-[#384A59] bg-[#171B1F] p-5 transition hover:-translate-y-1 hover:border-[#99692E] hover:bg-[#22282D]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                    VO-LIC-{String(license.id).padStart(3, "0")}
                  </p>

                  <h3 className="mt-3 text-xl font-bold uppercase tracking-wider text-[#D9D9D9]">
                    {license.name}
                  </h3>
                </div>

                <Badge variant="gold">{license.shortName}</Badge>
              </div>

              <p className="mt-5 text-sm leading-6 text-[#737373]">
                {license.summary}
              </p>

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
      </div>
    </section>
  )
}

export default IndustrySection