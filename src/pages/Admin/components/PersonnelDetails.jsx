import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"

function formatDate(dateValue) {
  if (!dateValue) {
    return "Unknown"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue))
}

function PersonnelDetails({
  person,
  removingMembershipId,
  onClose,
  onNavigate,
  onRemoveFactionMember,
}) {
  if (!person) {
    return null
  }

  const membership = person.membership

  const displayName =
    person.character_name ??
    person.discord_username ??
    "Unnamed User"

  const hasApprovedMembership =
    membership?.status === "approved"

  const isFactionOwner =
    hasApprovedMembership &&
    membership?.member_role === "owner"

  const canRemoveFromFaction =
    hasApprovedMembership &&
    membership?.member_role !== "owner"

  return (
    <div className="mt-8 border border-[#99692E] bg-[#111519] p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          {person.avatar_url ? (
            <img
              src={person.avatar_url}
              alt=""
              className="h-20 w-20 border border-[#384A59] object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center border border-[#384A59] text-2xl font-bold text-[#99692E]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
              Personnel Record
            </p>

            <h3 className="mt-2 text-2xl font-bold uppercase tracking-wider">
              {displayName}
            </h3>
          </div>
        </div>

        <Button variant="outline" onClick={onClose}>
          Close Details
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border border-[#384A59] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
            Site Role
          </p>

          <div className="mt-3">
            <Badge
              variant={
                person.role === "admin"
                  ? "success"
                  : "default"
              }
            >
              {person.role}
            </Badge>
          </div>
        </div>

        <div className="border border-[#384A59] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
            Discord / Authentication
          </p>

          <p className="mt-3 font-bold">
            {person.discord_username || "Email Authentication"}
          </p>
        </div>

        <div className="border border-[#384A59] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
            Registered
          </p>

          <p className="mt-3 font-bold">
            {formatDate(person.created_at)}
          </p>
        </div>

        <div className="border border-[#384A59] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
            Faction
          </p>

          <p className="mt-3 font-bold">
            {hasApprovedMembership
              ? membership?.factions?.name ?? "Unaffiliated"
              : "Unaffiliated"}
          </p>

          {hasApprovedMembership &&
            membership?.factions?.short_name && (
              <p className="mt-1 text-sm uppercase tracking-wider text-[#99692E]">
                {membership.factions.short_name}
              </p>
            )}
        </div>

        <div className="border border-[#384A59] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
            Faction Role
          </p>

          <p className="mt-3 font-bold capitalize">
            {hasApprovedMembership
              ? membership?.member_role ?? "None"
              : "None"}
          </p>
        </div>

        <div className="border border-[#384A59] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
            Membership Status
          </p>

          <div className="mt-3">
            {membership ? (
              <Badge
                variant={
                  membership.status === "approved"
                    ? "success"
                    : membership.status === "rejected" ||
                        membership.status === "removed"
                      ? "danger"
                      : "gold"
                }
              >
                {membership.status}
              </Badge>
            ) : (
              <Badge>None</Badge>
            )}
          </div>
        </div>
      </div>

      {membership && (
        <div className="mt-6 flex flex-wrap gap-3 border-t border-[#384A59] pt-6">
          {hasApprovedMembership &&
            membership.factions?.short_name && (
              <Button
                variant="secondary"
                onClick={() =>
                  onNavigate(
                    `/factions/${membership.factions.short_name}`
                  )
                }
              >
                View Their Faction
              </Button>
            )}

          {canRemoveFromFaction && (
            <Button
              variant="outline"
              disabled={removingMembershipId === membership.id}
              onClick={() => onRemoveFactionMember(person)}
            >
              {removingMembershipId === membership.id
                ? "Removing..."
                : "Remove from Faction"}
            </Button>
          )}

          {isFactionOwner && (
            <p className="w-full text-sm leading-6 text-[#737373]">
              Faction owners cannot be removed until ownership has been
              transferred.
            </p>
          )}

          {membership.status === "removed" && (
            <p className="w-full text-sm leading-6 text-[#737373]">
              This person has been removed from their previous faction.
            </p>
          )}

          {membership.status === "rejected" && (
            <p className="w-full text-sm leading-6 text-[#737373]">
              This person’s faction membership request was rejected.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default PersonnelDetails