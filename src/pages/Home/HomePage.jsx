const factions = []

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
            <button className="border border-[#99692E] bg-[#99692E] px-8 py-3 font-bold uppercase tracking-widest text-[#171B1F] transition hover:bg-transparent hover:text-[#D9D9D9]">
              Continue with Discord
            </button>

            <button className="border border-[#384A59] bg-[#384A59] px-8 py-3 font-bold uppercase tracking-widest text-[#D9D9D9] transition hover:bg-transparent">
              Use Invitation Code
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#171B1F] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 border-b border-[#384A59] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
                Public Directory
              </p>

              <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider">
                Registered Factions
              </h2>
            </div>

            <p className="text-sm uppercase tracking-widest text-[#737373]">
              {factions.length} factions active
            </p>
          </div>

          {factions.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center border border-dashed border-[#384A59] bg-[#1D2328] px-6 text-center">
              <div>
                <p className="text-xl font-bold uppercase tracking-wider">
                  No factions registered yet
                </p>

                <p className="mt-2 text-[#737373]">
                  Faction names, logos, leaders, licenses, and member counts
                  will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {factions.map((faction) => (
                <article
                  key={faction.id}
                  className="border border-[#384A59] bg-[#1D2328] p-6"
                >
                  <h3 className="text-2xl font-bold uppercase tracking-wider">
                    {faction.name}
                  </h3>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default HomePage