import Badge from "../../../components/ui/Badge"
import Card from "../../../components/ui/Card"

function CompanyLicenseList({ licenses = [] }) {
  const activeLicenses = licenses.filter(
    (license) => license.status === "active"
  )

  return (
    <Card
      title="Operating Licenses"
      subtitle="Registered commercial authorities"
    >
      {activeLicenses.length === 0 ? (
        <p className="leading-7 text-[#737373]">
          This company does not currently hold any active operating licenses.
        </p>
      ) : (
        <div className="space-y-4">
          {activeLicenses.map((license) => {
            const licenseType = license.license_types

            return (
              <div
                key={license.id}
                className="border border-[#384A59] bg-[#111519] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                      {licenseType?.classification ?? "Operating License"}
                    </p>

                    <h3 className="mt-2 text-lg font-bold uppercase tracking-wider">
                      {licenseType?.name ?? "Unknown License"}
                    </h3>

                    {licenseType?.short_name && (
                      <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
                        [{licenseType.short_name}]
                      </p>
                    )}
                  </div>

                  <Badge variant="success">
                    Active
                  </Badge>
                </div>

                {licenseType?.summary && (
                  <p className="mt-4 leading-7 text-[#737373]">
                    {licenseType.summary}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default CompanyLicenseList