const MIGRATION_LABELS = {
  faction_and_matching_company: "Faction + Matching Company",
  faction_and_separate_company: "Faction + Separate Company",
  company_under_faction: "Company Under Another Faction",
  faction_only: "Faction Only",
}

function MigrationSummary({
  migrationType,
  faction,
  companyData,
  targetFaction,
}) {
  if (!migrationType) {
    return null
  }

  const createsCompany = migrationType !== "faction_only"

  const companyName =
    migrationType === "faction_and_separate_company"
      ? companyData.name
      : faction.name

  const companyTag =
    migrationType === "faction_and_separate_company"
      ? companyData.shortName
      : faction.short_name

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E]">
          Final Review
        </p>

        <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider">
          Migration Summary
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-[#737373]">
          Review your organization structure before continuing. No changes
          have been made yet.
        </p>
      </div>

      <div className="space-y-4">
        <SummaryRow
          label="Migration Type"
          value={MIGRATION_LABELS[migrationType]}
        />

        <SummaryRow
          label="Current Organization"
          value={`${faction.name} [${faction.short_name}]`}
        />

        {createsCompany && (
          <SummaryRow
            label="Company"
            value={
                companyName && companyTag
                ? `${companyName} [${companyTag}]`
                : "Not provided"
            }
          />
        )}

        {migrationType === "company_under_faction" && (
          <SummaryRow
            label="Target Faction"
            value={
              targetFaction
                ? `${targetFaction.name} [${targetFaction.short_name}]`
                : "Not selected"
            }
          />
        )}
      </div>

      <div className="mt-6 border border-[#384A59] bg-[#111519] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
          Migration Effects
        </p>

        <p className="mt-3 leading-7 text-[#737373]">
          {getMigrationDescription(migrationType)}
        </p>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex flex-col justify-between gap-2 border-b border-[#384A59] pb-4 sm:flex-row">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
        {label}
      </span>

      <span className="text-[#D9D9D9]">
        {value || "Not provided"}
      </span>
    </div>
  )
}

function getMigrationDescription(migrationType) {
  switch (migrationType) {
    case "faction_and_matching_company":
      return "Your existing Faction will remain intact and a matching Company will be created. Approved personnel and existing licenses will be copied into the Company."

    case "faction_and_separate_company":
      return "Your existing Faction will remain intact and the new Company will operate beneath it. Approved personnel and existing licenses will be copied into the new Company."

    case "company_under_faction":
      return "Your existing organization identity will become a Company. Its intended affiliation with the selected Faction will be staged for approval. Approved personnel and existing licenses will be copied into the Company."

    case "faction_only":
      return "Your existing organization will remain a Faction only. No Company will be created during this migration."

    default:
      return ""
  }
}

export default MigrationSummary