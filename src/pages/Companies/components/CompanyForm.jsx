function CompanyForm({
  formData,
  onChange,
  licenseTypes,
  selectedLicenseIds,
  onToggleLicense,
  availableFactions,
}) {
  function handleChange(event) {
    const { name, value, type, checked } = event.target

    onChange({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  function handleTagChange(event) {
    onChange({
      ...formData,
      shortName: event.target.value
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 3),
    })
  }

  return (
    <div className="space-y-8">
      <section>
        <SectionHeader
          title="Company Identity"
          subtitle="Public registry information"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={50}
            required
          />

          <div>
            <Field
              label="Company Tag"
              name="shortName"
              value={formData.shortName}
              onChange={handleTagChange}
              maxLength={3}
              required
            />

            <p className="mt-2 text-sm leading-6 text-[#737373]">
              Two or three letters only. Company tags must remain compatible
              with Space Engineers faction tags.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Company Profile"
          subtitle="Branding and historical information"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Logo URL"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
          />

          <Field
            label="Founded Date"
            name="foundedDate"
            type="date"
            value={formData.foundedDate}
            onChange={handleChange}
            required
          />

          <Field
            label="Motto"
            name="motto"
            value={formData.motto}
            onChange={handleChange}
          />

          <Field
            label="Primary Color"
            name="primaryColor"
            value={formData.primaryColor}
            onChange={handleChange}
            placeholder="#384A59"
          />

          <Field
            label="Secondary Color"
            name="secondaryColor"
            value={formData.secondaryColor}
            onChange={handleChange}
            placeholder="#D9D9D9"
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Faction Affiliation"
          subtitle="Optional in-game umbrella"
        />

        <select
          name="factionId"
          value={formData.factionId}
          onChange={handleChange}
          className="w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
        >
          <option value="">
            Independent Company
          </option>

          {availableFactions.map((faction) => (
            <option
              key={faction.id}
              value={faction.id}
            >
              {faction.name} [{faction.short_name}]
            </option>
          ))}
        </select>

        <p className="mt-3 text-sm leading-6 text-[#737373]">
          You can only create a Company directly under a Faction you already
          belong to. Other affiliations use the request workflow.
        </p>
      </section>

      <section>
        <SectionHeader
          title="Recruitment"
          subtitle="Company membership availability"
        />

        <label className="flex items-start gap-3 border border-[#384A59] bg-[#111519] p-5">
          <input
            type="checkbox"
            name="recruiting"
            checked={formData.recruiting}
            onChange={handleChange}
            className="mt-1"
          />

          <div>
            <p className="font-bold uppercase tracking-wider">
              Open Recruitment
            </p>

            <p className="mt-2 text-sm leading-6 text-[#737373]">
              Allow personnel to submit membership requests to this Company.
            </p>
          </div>
        </label>
      </section>

      <section>
        <SectionHeader
          title="Operating Licenses"
          subtitle="Select one or two"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {licenseTypes.map((license) => {
            const isSelected = selectedLicenseIds.includes(license.id)

            return (
              <button
                key={license.id}
                type="button"
                onClick={() => onToggleLicense(license.id)}
                className={`border p-5 text-left transition ${
                  isSelected
                    ? "border-[#99692E] bg-[#99692E]/10"
                    : "border-[#384A59] bg-[#111519] hover:border-[#99692E]"
                }`}
              >
                <p className="font-bold uppercase tracking-wider">
                  {license.name}
                </p>

                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
                  [{license.short_name}]
                </p>

                {license.summary && (
                  <p className="mt-3 text-sm leading-6 text-[#737373]">
                    {license.summary}
                  </p>
                )}
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-sm text-[#737373]">
          Selected: {selectedLicenseIds.length} / 2
        </p>
      </section>
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-5 border-b border-[#384A59] pb-4">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E]">
        {subtitle}
      </p>

      <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider">
        {title}
      </h2>
    </div>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  ...props
}) {
  return (
    <label>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
        {...props}
      />
    </label>
  )
}

function TextArea({
  label,
  name,
  value,
  onChange,
  ...props
}) {
  return (
    <label>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">
        {label}
      </span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
        {...props}
      />
    </label>
  )
}

export default CompanyForm