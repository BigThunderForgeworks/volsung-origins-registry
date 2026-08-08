import Badge from "../../../components/ui/Badge"

function CompanyHeader({ company }) {
  return (
    <header className="border border-[#384A59] bg-[#1D2328] p-7 sm:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="w-full shrink-0 lg:w-40">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={`${company.name} logo`}
              className="aspect-square w-full border border-[#384A59] object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center border border-[#384A59] bg-[#111519] text-center text-xs uppercase tracking-wider text-[#737373]">
              No Logo
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-3">
            <Badge variant="gold">
              Company
            </Badge>

            <Badge
              variant={company.recruiting ? "success" : "danger"}
            >
              {company.recruiting
                ? "Recruiting"
                : "Recruitment Closed"}
            </Badge>
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Registered Corporate Entity
          </p>

          <h1 className="mt-3 text-4xl font-bold uppercase tracking-wider sm:text-5xl">
            {company.name}
          </h1>

          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[#737373]">
            [{company.short_name}]
          </p>

          {company.motto && (
            <p className="mt-6 text-lg italic text-[#D9D9D9]">
              “{company.motto}”
            </p>
          )}

          {company.description && (
            <p className="mt-6 max-w-3xl leading-8 text-[#A6A6A6]">
              {company.description}
            </p>
          )}

          <div className="mt-8 grid gap-px border border-[#384A59] bg-[#384A59] sm:grid-cols-2">
            <InfoCell
              label="Faction Affiliation"
              value={
                company.factions
                  ? `${company.factions.name} [${company.factions.short_name}]`
                  : "Independent"
              }
            />

            <InfoCell
              label="Founder"
              value={company.founder_name ?? "Not Specified"}
            />

            <InfoCell
              label="Founded"
              value={formatDate(company.founded_date)}
            />

            <InfoCell
              label="Status"
              value={company.status}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

function InfoCell({ label, value }) {
  return (
    <div className="bg-[#111519] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
        {label}
      </p>

      <p className="mt-2 text-sm uppercase tracking-wider text-[#D9D9D9]">
        {value}
      </p>
    </div>
  )
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not Specified"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue))
}

export default CompanyHeader