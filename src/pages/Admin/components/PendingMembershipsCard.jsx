import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"

function PendingMembershipsCard({
  pendingMemberships,
  reviewingMembershipId,
  onReviewMembership,
}) {
  return (
    <Card
      title="Pending Membership Requests"
      subtitle="Administrator override"
    >
      {pendingMemberships.length > 0 ? (
        <div className="space-y-5">
          {pendingMemberships.map((membership) => {
            const isReviewing =
              reviewingMembershipId === membership.id

            const applicantName =
              membership.profiles?.character_name ??
              membership.profiles?.discord_username ??
              "Unknown Applicant"

            return (
              <div
                key={membership.id}
                className="flex flex-col gap-5 border-b border-[#384A59] pb-5 last:border-b-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-center gap-4">
                  {membership.profiles?.avatar_url ? (
                    <img
                      src={membership.profiles.avatar_url}
                      alt=""
                      className="h-14 w-14 border border-[#384A59] object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center border border-[#384A59] bg-[#111519] text-xl font-bold text-[#99692E]">
                      {applicantName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="font-bold">{applicantName}</p>

                    <p className="mt-1 text-sm text-[#737373]">
                      Requested membership in{" "}
                      {membership.factions?.name ??
                        "Unknown Faction"}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#737373]">
                      {membership.factions?.short_name ?? "No Tag"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={isReviewing}
                    onClick={() =>
                      onReviewMembership(
                        membership.id,
                        "approved"
                      )
                    }
                  >
                    {isReviewing ? "Reviewing..." : "Approve"}
                  </Button>

                  <Button
                    variant="outline"
                    disabled={isReviewing}
                    onClick={() =>
                      onReviewMembership(
                        membership.id,
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
          There are no pending membership requests.
        </p>
      )}
    </Card>
  )
}

export default PendingMembershipsCard