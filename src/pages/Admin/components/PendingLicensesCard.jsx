import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"

function PendingLicensesCard({
  pendingLicenses,
  reviewingLicenseId,
  onReviewLicense,
}) {
  return (
    <Card
      title="Pending License Applications"
      subtitle="Administrator review"
    >
      {pendingLicenses.length > 0 ? (
        <div className="space-y-5">
          {pendingLicenses.map((license) => {
            const isReviewing =
              reviewingLicenseId === license.id

            return (
              <div
                key={license.id}
                className="flex flex-col gap-5 border-b border-[#384A59] pb-5 last:border-b-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="gold">
                      {license.license_types?.name ??
                        "Unknown License"}
                    </Badge>

                    <Badge>
                      {license.factions?.short_name ??
                        "Unknown Faction"}
                    </Badge>
                  </div>

                  <h2 className="mt-4 text-xl font-bold uppercase tracking-wider">
                    {license.factions?.name ?? "Unknown Faction"}
                  </h2>

                  <p className="mt-2 text-sm text-[#737373]">
                    Founder:{" "}
                    {license.factions?.founder_name ?? "Unknown"}
                  </p>

                  <p className="mt-1 text-sm text-[#737373]">
                    Classification:{" "}
                    {license.license_types?.classification ??
                      "Unclassified"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={isReviewing}
                    onClick={() =>
                      onReviewLicense(
                        license.id,
                        "active"
                      )
                    }
                  >
                    {isReviewing ? "Reviewing..." : "Approve"}
                  </Button>

                  <Button
                    variant="outline"
                    disabled={isReviewing}
                    onClick={() =>
                      onReviewLicense(
                        license.id,
                        "rejected"
                      )
                    }
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="leading-7 text-[#737373]">
          There are no pending license applications.
        </p>
      )}
    </Card>
  )
}

export default PendingLicensesCard