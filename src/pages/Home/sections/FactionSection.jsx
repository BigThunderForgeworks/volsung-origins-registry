import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"

const factions = [
  {
    id: 1,
    name: "Black Forge",
    license: "Mining",
    members: 14,
    recruiting: true,
  },
  {
    id: 2,
    name: "Atlas Dynamics",
    license: "Logistics",
    members: 8,
    recruiting: false,
  },
  {
    id: 3,
    name: "Helios Industrial",
    license: "Manufacturing",
    members: 21,
    recruiting: true,
  },
]

function FactionSection() {
  return (
    <section className="border-b border-[#384A59] bg-[#171B1F] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#384A59] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
              Public Directory
            </p>

            <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider">
              Registered Factions
            </h2>
          </div>

          <p className="text-sm uppercase tracking-widest text-[#737373]">
            {factions.length} Factions Active
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {factions.map((faction) => (
            <Card key={faction.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider text-[#D9D9D9]">
                    {faction.name}
                  </h3>

                  <div className="mt-3">
                    <Badge variant="gold">
                      {faction.license} License
                    </Badge>
                  </div>
                </div>

                <Badge
                  variant={faction.recruiting ? "success" : "danger"}
                >
                  {faction.recruiting ? "Recruiting" : "Closed"}
                </Badge>
              </div>

              <div className="mt-6 border-t border-[#384A59] pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">
                    Registered Members
                  </span>

                  <span className="text-2xl font-bold text-[#D9D9D9]">
                    {faction.members}
                  </span>
                </div>

                <Button variant="outline" className="mt-6 w-full">
                  View Registry
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FactionSection