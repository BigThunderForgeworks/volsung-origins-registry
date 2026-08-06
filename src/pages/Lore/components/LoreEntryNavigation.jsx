import { Link } from "react-router-dom"

function LoreEntryNavigation({
  previousEntry,
  nextEntry,
  className = "",
}) {
  return (
    <nav
      aria-label="Lore entry navigation"
      className={`grid gap-3 border border-[#384A59] bg-[#111519] p-4 sm:grid-cols-3 ${className}`}
    >
      <div>
        {previousEntry ? (
          <Link
            to={`/lore/${previousEntry.slug}`}
            className="group block h-full border border-[#384A59] p-4 transition hover:border-[#99692E]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
              Previous Entry
            </p>

            <p className="mt-2 font-bold uppercase tracking-wider text-[#D9D9D9] transition group-hover:text-[#99692E]">
              ← Entry {String(previousEntry.entry_number).padStart(2, "0")}
            </p>

            <p className="mt-2 text-sm text-[#737373]">
              {previousEntry.title}
            </p>
          </Link>
        ) : (
          <div className="h-full border border-[#242C32] p-4 opacity-50">
            <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
              Previous Entry
            </p>

            <p className="mt-2 text-sm text-[#737373]">
              Beginning of archive
            </p>
          </div>
        )}
      </div>

      <Link
        to="/lore"
        className="flex min-h-24 items-center justify-center border border-[#99692E] px-4 py-5 text-center text-sm font-bold uppercase tracking-[0.25em] text-[#99692E] transition hover:bg-[#99692E]/10 hover:text-[#D9D9D9]"
      >
        Lore Archive
      </Link>

      <div>
        {nextEntry ? (
          <Link
            to={`/lore/${nextEntry.slug}`}
            className="group block h-full border border-[#384A59] p-4 text-right transition hover:border-[#99692E]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
              Next Entry
            </p>

            <p className="mt-2 font-bold uppercase tracking-wider text-[#D9D9D9] transition group-hover:text-[#99692E]">
              Entry {String(nextEntry.entry_number).padStart(2, "0")} →
            </p>

            <p className="mt-2 text-sm text-[#737373]">
              {nextEntry.title}
            </p>
          </Link>
        ) : (
          <div className="h-full border border-[#242C32] p-4 text-right opacity-50">
            <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
              Next Entry
            </p>

            <p className="mt-2 text-sm text-[#737373]">
              Latest available record
            </p>
          </div>
        )}
      </div>
    </nav>
  )
}

export default LoreEntryNavigation