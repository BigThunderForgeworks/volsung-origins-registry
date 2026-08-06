import { Link } from "react-router-dom"
import Badge from "../../../components/ui/Badge"
import Card from "../../../components/ui/Card"

function FactionLicensesCard({ licenses }) {
  return (
    <Card
      title="Operating Licenses"
      subtitle="Approved industrial authorizations"
    >
      {licenses.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {licenses.map((license) => {
            const licenseType = license.license_types

            if (!licenseType?.slug) {
              return null
            }

            return (
              <Link
                key={license.id}
                to={`/licenses/${licenseType.slug}`}
              >
                <Badge variant="success">
                  {licenseType.name ?? "Unknown License"}
                </Badge>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-[#737373]">
          No approved licenses are currently assigned to this faction.
        </p>
      )}
    </Card>
  )
}

export default FactionLicensesCard