import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"

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

function HomePage() {
  return (
    <>
      <section className="border-b border-[#384A59] bg-[#22282D]">
        <div className="mx-auto flex min-h-[560px] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#99692E]">
            Industrial Registry Terminal
          </p>

          <h1 className="text-5xl font-bold uppercase tracking-[0.12em] sm:text-7xl lg:text-8xl">
            Volsung Origins
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A6A6A6]">
            Register your character, establish a faction, and apply for an
            industry license within the Volsung Origins server.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button>Continue with Discord</Button>

            <Button variant="secondary">
              Use Invitation Code
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#171B1F] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 border-b border-[#384A59] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
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
              <Card
                key={faction.id}
                title={faction.name}
                subtitle={faction.license}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Members</span>
                    <span className="font-bold text-[#D9D9D9]">
                      {faction.members}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Recruitment</span>

                    <span
                      className={`font-bold ${
                        faction.recruiting
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {faction.recruiting ? "OPEN" : "CLOSED"}
                    </span>
                  </div>

                  <Button variant="outline" className="mt-4 w-full">
                    View Faction
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage