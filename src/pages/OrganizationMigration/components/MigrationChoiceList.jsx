const MIGRATION_CHOICES = [
  {
    value: "faction_and_matching_company",
    title: "Faction + Matching Company",
    description:
      "Keep your current organization as the in-game Faction and create a Company with the same name and identity.",
    example: "Volsung Industries → Volsung Industries Company",
  },
  {
    value: "faction_and_separate_company",
    title: "Faction + Separate Company",
    description:
      "Keep your current organization as the in-game Faction and create a differently named Company underneath it.",
    example: "RECAST → SLA",
  },
  {
    value: "company_under_faction",
    title: "Company Under Another Faction",
    description:
      "Keep your current organization identity as a Company and place it under a different in-game Faction umbrella.",
    example: "Titan → Company under RECAST",
  },
  {
    value: "faction_only",
    title: "Faction Only",
    description:
      "Keep this organization only as an in-game Faction umbrella. No Company will be created during migration.",
    example: "Faction remains available for future Companies",
  },
]

function MigrationChoiceList({
  selectedChoice,
  onSelectChoice,
}) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E]">
          Step 1
        </p>

        <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider">
          Choose Organization Structure
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-[#737373]">
          Select how your existing organization should be represented in the
          new Company and Faction structure.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {MIGRATION_CHOICES.map((choice) => {
          const isSelected = selectedChoice === choice.value

          return (
            <button
              key={choice.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                onSelectChoice(isSelected ? "" : choice.value)}
              className={`border p-6 text-left transition ${
                isSelected
                  ? "border-[#99692E] bg-[#99692E]/10"
                  : "border-[#384A59] bg-[#111519] hover:border-[#99692E]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-[#D9D9D9]">
                    {choice.title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#737373]">
                    {choice.description}
                  </p>
                </div>

                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border text-sm font-bold ${
                    isSelected
                      ? "border-[#99692E] bg-[#99692E] text-[#171B1F]"
                      : "border-[#384A59] text-transparent"
                  }`}
                >
                  ✓
                </span>
              </div>

              <div className="mt-5 border-t border-[#242C32] pt-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
                  Example
                </p>

                <p className="mt-2 text-sm text-[#99692E]">
                  {choice.example}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MigrationChoiceList