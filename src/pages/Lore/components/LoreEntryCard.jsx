import { Link } from "react-router-dom"
import Badge from "../../../components/ui/Badge"

function formatEntryNumber(entryNumber) {
  return String(entryNumber).padStart(2, "0")
}

function formatPublishDate(dateValue) {
  if (!dateValue) {
    return "Undated Record"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue))
}

function LoreEntryCard({ entry }) {
  return (
    <Link
      to={`/lore/${entry.slug}`}
      className="group flex h-full flex-col border border-[#384A59] bg-[#111519] p-6 transition hover:-translate-y-1 hover:border-[#99692E]"
    >
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

      <p className="mt-5 text-xs uppercase tracking-[0.25em] text-[#737373]">
        {entry.document_type}
      </p>

      <h2 className="mt-3 text-2xl font-bold uppercase tracking-wider text-[#D9D9D9]">
        {entry.title}
      </h2>

      <p className="mt-5 flex-1 leading-7 text-[#737373]">
        {entry.summary}
      </p>

      <div className="mt-6 border-t border-[#384A59] pt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
          Classification
        </p>

        <p className="mt-2 text-sm uppercase tracking-wider text-[#D9D9D9]">
          {entry.classification}
        </p>
      </div>

      {entry.target_system && (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
            Target System
          </p>

          <p className="mt-2 text-sm text-[#D9D9D9]">
            {entry.target_system}
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-[#384A59] pt-4">
        <span className="text-xs uppercase tracking-widest text-[#737373]">
          {formatPublishDate(entry.published_at)}
        </span>

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E] transition group-hover:translate-x-1">
          Open Record →
        </span>
      </div>
    </Link>
  )
}

export default LoreEntryCard