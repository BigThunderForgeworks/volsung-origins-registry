import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"

function RegisteredFactionsCard({
  factions,
  onNavigate,
}) {
  return (
    <Card
      title="Registered Factions"
      subtitle="Current registry organizations"
    >
      {factions.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {factions.map((faction) => (
            <div
              key={faction.id}
              className="border border-[#384A59] bg-[#111519] p-5"
            >
              <div className="flex items-start gap-4">
                {faction.logo_url ? (
                  <img
                    src={faction.logo_url}
                    alt={`${faction.name} logo`}
                    className="h-16 w-16 border border-[#384A59] object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center border border-[#384A59] text-xs uppercase text-[#737373]">
                    No Logo
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="gold">
                      {faction.short_name}
                    </Badge>

                    <Badge
                      variant={
                        faction.status === "active"
                          ? "success"
                          : "danger"
                      }
                    >
                      {faction.status}
                    </Badge>
                  </div>

                  <h3 className="mt-3 text-lg font-bold uppercase tracking-wider">
                    {faction.name}
                  </h3>

                  <p className="mt-2 text-sm text-[#737373]">
                    Founder: {faction.founder_name}
                  </p>

                  <p className="mt-1 text-sm text-[#737373]">
                    Recruitment:{" "}
                    {faction.recruiting ? "Open" : "Closed"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    onNavigate(`/factions/${faction.short_name}`)
                  }
                >
                  View Registry
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() =>
                    onNavigate(
                      `/factions/${faction.short_name}/edit`
                    )
                  }
                >
                  Edit Faction
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="leading-7 text-[#737373]">
          No factions are registered.
        </p>
      )}
    </Card>
  )
}

export default RegisteredFactionsCard