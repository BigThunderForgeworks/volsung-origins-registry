function MigrationCompanyForm({
  migrationType,
  faction,
  companyData,
  onChange,
}) {
  if (
    migrationType === "faction_only" ||
    migrationType === ""
  ) {
    return null
  }

  const usesExistingIdentity =
    migrationType === "faction_and_matching_company" ||
    migrationType === "company_under_faction"

  function handleChange(event) {
    const { name, value } = event.target

    onChange({
      ...companyData,
      [name]: value,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E]">
          Step 2
        </p>

        <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider">
          Company Identity
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-[#737373]">
          {usesExistingIdentity
            ? "Your existing organization identity will be used for the new Company."
            : "Define the Company that will operate beneath your existing Faction."}
        </p>
      </div>

      {usesExistingIdentity ? (
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField
            label="Company Name"
            value={faction.name}
          />

          <ReadOnlyField
            label="Company Tag"
            value={faction.short_name}
          />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <label>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
              Company Name
            </span>

            <input
              type="text"
              name="name"
              value={companyData.name}
              onChange={handleChange}
              maxLength={50}
              placeholder="SLA"
              className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
            />
          </label>

          <label>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
              Company Tag
            </span>

            <input
              type="text"
              name="shortName"
              value={companyData.shortName}
              onChange={(event) =>
                onChange({
                  ...companyData,
                  shortName: event.target.value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, "")
                    .slice(0, 3),
                })
              }
              maxLength={3}
              placeholder="SLA"
              className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 uppercase text-[#D9D9D9] outline-none focus:border-[#99692E]"
            />
            <p className="mt-2 text-sm leading-6 text-[#737373]">
                Two or three letters only. Company tags are automatically converted to
                uppercase and must remain compatible with Space Engineers faction tags.
            </p>
          </label>
        </div>
      )}
    </div>
  )
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
        {label}
      </p>

      <div className="mt-2 border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9]">
        {value}
      </div>
    </div>
  )
}

export default MigrationCompanyForm