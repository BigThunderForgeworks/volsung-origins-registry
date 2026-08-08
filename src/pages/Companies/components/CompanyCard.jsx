import { useNavigate } from "react-router-dom"
import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"

function CompanyCard({ company }) {
  const navigate = useNavigate()

  const approvedLicenses =
    company.company_licenses?.filter(
      (license) => license.status === "active"
    ) ?? []

  const memberCount =
    company.company_memberships?.filter(
      (membership) => membership.status === "approved"
    ).length ?? 0

  return (
    <Card>
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="w-full shrink-0 sm:w-28">
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
                Company Registry
              </p>

              <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider">
                {company.name}
              </h2>

              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
                [{company.short_name}]
              </p>
            </div>

            <Badge
              variant={company.recruiting ? "success" : "danger"}
            >
              {company.recruiting
                ? "Recruiting"
                : "Recruitment Closed"}
            </Badge>
          </div>

          {company.motto && (
            <p className="mt-4 italic text-[#D9D9D9]">
              “{company.motto}”
            </p>
          )}

          {company.description && (
            <p className="mt-4 line-clamp-3 leading-7 text-[#737373]">
              {company.description}
            </p>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="border border-[#384A59] bg-[#111519] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                Faction Affiliation
              </p>

              <p className="mt-2 font-bold">
                {company.factions
                  ? `${company.factions.name} [${company.factions.short_name}]`
                  : "Independent"}
              </p>
            </div>

            <div className="border border-[#384A59] bg-[#111519] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                Personnel
              </p>

              <p className="mt-2 font-bold">
                {memberCount}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
              Operating Licenses
            </p>

            {approvedLicenses.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {approvedLicenses.map((license) => (
                  <Badge
                    key={license.id}
                    variant="gold"
                  >
                    {license.license_types?.short_name ??
                      license.license_types?.name ??
                      "License"}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#737373]">
                No approved operating licenses.
              </p>
            )}
          </div>

          <Button
            className="mt-6"
            variant="outline"
            onClick={() =>
              navigate(`/companies/${company.short_name}`)
            }
          >
            View Company Registry
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default CompanyCard