import Badge from "../../../components/ui/Badge"
import Card from "../../../components/ui/Card"
import PersonnelDetails from "./PersonnelDetails"

function PersonnelDirectory({
  personnel,
  selectedPerson,
  removingMembershipId,
  onSelectPerson,
  onCloseDetails,
  onNavigate,
  onRemoveFactionMember,
}) {
  return (
    <Card
      title="Registered Personnel"
      subtitle="Select a user to review their registry details"
    >
      {personnel.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {personnel.map((person) => {
            const displayName =
              person.character_name ??
              person.discord_username ??
              "Unnamed User"

            const isSelected = selectedPerson?.id === person.id

            return (
              <button
                key={person.id}
                type="button"
                onClick={() => onSelectPerson(person)}
                className={`flex w-full items-center justify-between gap-4 border p-4 text-left transition ${
                  isSelected
                    ? "border-[#99692E] bg-[#99692E]/10"
                    : "border-[#384A59] bg-[#111519] hover:border-[#99692E]"
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  {person.avatar_url ? (
                    <img
                      src={person.avatar_url}
                      alt=""
                      className="h-12 w-12 shrink-0 border border-[#384A59] object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#384A59] font-bold text-[#99692E]">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-bold">
                      {displayName}
                    </p>

                    <p className="mt-1 truncate text-sm text-[#737373]">
                      {person.discord_username || "Email Authentication"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Badge
                    variant={
                      person.role === "admin"
                        ? "success"
                        : "default"
                    }
                  >
                    {person.role}
                  </Badge>

                  <span className="text-[#99692E]">
                    {isSelected ? "−" : "+"}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <p className="leading-7 text-[#737373]">
          No personnel are registered.
        </p>
      )}

      <PersonnelDetails
        person={selectedPerson}
        removingMembershipId={removingMembershipId}
        onClose={onCloseDetails}
        onNavigate={onNavigate}
        onRemoveFactionMember={onRemoveFactionMember}
      />
    </Card>
  )
}

export default PersonnelDirectory