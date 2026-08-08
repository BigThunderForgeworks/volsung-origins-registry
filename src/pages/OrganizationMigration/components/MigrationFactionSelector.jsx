function MigrationFactionSelector({
  factions,
  selectedFactionId,
  onSelectFaction,
}) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E]">
          Step 3
        </p>

        <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider">
          Select Faction Umbrella
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-[#737373]">
          Choose the in-game Faction your Company intends to operate under.
          The affiliation will remain staged until the receiving Faction
          approves it.
        </p>
      </div>

      <select
        value={selectedFactionId}
        onChange={(event) => onSelectFaction(event.target.value)}
        className="w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
      >
        <option value="">
          Select a faction
        </option>

        {factions.map((faction) => (
          <option
            key={faction.id}
            value={faction.id}
          >
            {faction.name} [{faction.short_name}]
          </option>
        ))}
      </select>
    </div>
  )
}

export default MigrationFactionSelector