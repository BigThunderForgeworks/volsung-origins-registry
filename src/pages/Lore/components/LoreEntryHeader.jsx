import Badge from "../../../components/ui/Badge"

function formatEntryNumber(entryNumber) {
  return String(entryNumber).padStart(2, "0")
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Undated Record"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue))
}

function RecordField({ label, value }) {
  return (
    <div className="bg-[#111519] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
        {label}
      </p>

      <p className="mt-2 text-sm uppercase tracking-wider text-[#D9D9D9]">
        {value}
      </p>
    </div>
  )
}

function LoreEntryHeader({ entry }) {
  return (
    <header className="border border-[#384A59] bg-[#1D2328] p-7 sm:p-10">
      <div className="flex flex-wrap gap-3">
        <Badge variant="gold">
          Entry {formatEntryNumber(entry.entry_number)}
        </Badge>

        {entry.is_featured && (
          <Badge variant="success">
            Featured Record
          </Badge>
        )}
      </div>

      <p className="mt-7 text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
        {entry.series_title}
      </p>

      <p className="mt-3 text-sm uppercase tracking-[0.3em] text-[#737373]">
        {entry.document_type}
      </p>

      <h1 className="mt-6 text-4xl font-bold uppercase tracking-wider sm:text-5xl">
        {entry.title}
      </h1>

      <p className="mt-6 text-lg leading-8 text-[#A6A6A6]">
        {entry.summary}
      </p>

      <div className="mt-8 grid gap-px border border-[#384A59] bg-[#384A59] sm:grid-cols-2">
        <RecordField
          label="Classification"
          value={entry.classification}
        />

        <RecordField
          label="Recording Entity"
          value={entry.recording_entity}
        />

        <RecordField
          label="Target System"
          value={entry.target_system ?? "Not Specified"}
        />

        <RecordField
          label="Published"
          value={formatDate(entry.published_at)}
        />
      </div>
    </header>
  )
}

export default LoreEntryHeader