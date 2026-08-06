const MAX_LICENSES = 2

function FactionLicenseSelector({
  licenses,
  selectedLicenseIds,
  onToggleLicense,
}) {
  const hasReachedLimit =
    selectedLicenseIds.length >= MAX_LICENSES

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <p className="leading-7 text-[#737373]">
          Select one or two licenses under which this faction will operate.
          All selections require administrator approval.
        </p>

        <p className="shrink-0 text-sm font-bold uppercase tracking-[0.2em] text-[#99692E]">
          {selectedLicenseIds.length} / {MAX_LICENSES} Selected
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {licenses.map((license) => {
          const isSelected = selectedLicenseIds.includes(license.id)
          const isDisabled = hasReachedLimit && !isSelected

          return (
            <button
              key={license.id}
              type="button"
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => onToggleLicense(license.id)}
              className={`border p-5 text-left transition ${
                isSelected
                  ? "border-[#99692E] bg-[#99692E]/15"
                  : isDisabled
                    ? "cursor-not-allowed border-[#242C32] bg-[#111519] opacity-40"
                    : "border-[#384A59] bg-[#111519] hover:border-[#99692E]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold uppercase tracking-wider">
                    {license.name}
                  </p>

                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                    {license.short_name}
                  </p>
                </div>

                <span
                  className={`flex h-6 w-6 items-center justify-center border text-sm font-bold ${
                    isSelected
                      ? "border-[#99692E] bg-[#99692E] text-[#171B1F]"
                      : "border-[#384A59] text-transparent"
                  }`}
                >
                  ✓
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#737373]">
                {license.summary}
              </p>
            </button>
          )
        })}
      </div>

      {hasReachedLimit && (
        <p className="mt-5 text-sm leading-6 text-[#737373]">
          Two licenses are selected. Remove one selection before choosing a
          different license.
        </p>
      )}
    </div>
  )
}

export default FactionLicenseSelector