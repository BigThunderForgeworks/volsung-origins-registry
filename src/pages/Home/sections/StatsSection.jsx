const stats = [
  {
    id: 1,
    label: "Registered Personnel",
    value: 124,
    detail: "Approved registry profiles",
  },
  {
    id: 2,
    label: "Registered Factions",
    value: 3,
    detail: "Recognized industrial groups",
  },
  {
    id: 3,
    label: "Active Licenses",
    value: 3,
    detail: "Faction licenses currently issued",
  },
  {
    id: 4,
    label: "Open Recruitment",
    value: 2,
    detail: "Factions accepting applicants",
  },
]

function StatsSection() {
  return (
    <section className="border-b border-[#384A59] bg-[#171B1F] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Registry Overview
          </p>

          <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider text-[#D9D9D9]">
            Network Statistics
          </h2>
        </div>

        <div className="grid gap-px border border-[#384A59] bg-[#384A59] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.id}
              className="bg-[#1D2328] p-6 transition hover:bg-[#22282D]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                {stat.label}
              </p>

              <p className="mt-4 text-5xl font-bold text-[#D9D9D9]">
                {stat.value}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#737373]">
                {stat.detail}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-4 text-xs uppercase tracking-widest text-[#737373]">
          Development data shown until the live registry is connected.
        </p>
      </div>
    </section>
  )
}

export default StatsSection