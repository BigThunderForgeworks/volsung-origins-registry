import Badge from "../../../components/ui/Badge"
import Card from "../../../components/ui/Card"

function CompanyPersonnelList({ memberships = [] }) {
  const approvedMemberships = memberships.filter(
    (membership) => membership.status === "approved"
  )

  const sortedMemberships = [...approvedMemberships].sort(
    (firstMembership, secondMembership) =>
      getRolePriority(firstMembership.member_role) -
      getRolePriority(secondMembership.member_role)
  )

  return (
    <Card
      title="Company Personnel"
      subtitle="Registered corporate membership"
    >
      {sortedMemberships.length === 0 ? (
        <p className="leading-7 text-[#737373]">
          No approved company personnel are currently registered.
        </p>
      ) : (
        <div className="space-y-3">
          {sortedMemberships.map((membership) => {
            const profile = membership.profiles

            return (
              <div
                key={membership.id}
                className="flex flex-col gap-4 border border-[#384A59] bg-[#111519] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold uppercase tracking-wider">
                    {profile?.character_name ?? "Unnamed Personnel"}
                  </p>

                  {profile?.discord_username && (
                    <p className="mt-1 text-sm text-[#737373]">
                      {profile.discord_username}
                    </p>
                  )}
                </div>

                <Badge variant={getRoleVariant(membership.member_role)}>
                  {formatRole(membership.member_role)}
                </Badge>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

function getRolePriority(role) {
  switch (role) {
    case "owner":
      return 0
    case "officer":
      return 1
    default:
      return 2
  }
}

function getRoleVariant(role) {
  switch (role) {
    case "owner":
      return "gold"
    case "officer":
      return "success"
    default:
      return "default"
  }
}

function formatRole(role) {
  switch (role) {
    case "owner":
      return "Company Owner"
    case "officer":
      return "Officer"
    default:
      return "Member"
  }
}

export default CompanyPersonnelList