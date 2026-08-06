import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"

function formatEntryNumber(entryNumber) {
  return String(entryNumber).padStart(2, "0")
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not published"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue))
}

function getStatusVariant(status) {
  if (status === "published") {
    return "success"
  }

  if (status === "archived") {
    return "danger"
  }

  if (status === "queued") {
    return "gold"
  }

  return "default"
}

function LoreEntryList({
  entries,
  selectedEntryId,
  onCreateEntry,
  onSelectEntry,
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-[#384A59] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#737373]">
            Historical Records
          </p>

          <p className="mt-2 text-sm leading-6 text-[#737373]">
            Create and manage draft, queued, published, and archived lore
            entries.
          </p>
        </div>

        <Button onClick={onCreateEntry}>
          Create Lore Entry
        </Button>
      </div>

      {entries.length > 0 ? (
        <div className="mt-6 space-y-4">
          {entries.map((entry) => {
            const isSelected = selectedEntryId === entry.id

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelectEntry(entry)}
                className={`w-full border p-5 text-left transition ${
                  isSelected
                    ? "border-[#99692E] bg-[#99692E]/10"
                    : "border-[#384A59] bg-[#111519] hover:border-[#99692E]"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="gold">
                        Entry {formatEntryNumber(entry.entry_number)}
                      </Badge>

                      <Badge variant={getStatusVariant(entry.status)}>
                        {entry.status}
                      </Badge>

                      {entry.is_featured && (
                        <Badge variant="success">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <h3 className="mt-4 text-lg font-bold uppercase tracking-wider text-[#D9D9D9]">
                      {entry.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#737373]">
                      {entry.summary}
                    </p>
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                      Published
                    </p>

                    <p className="mt-2 text-sm text-[#D9D9D9]">
                      {formatDate(entry.published_at)}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 border border-[#384A59] bg-[#111519] p-6">
          <p className="leading-7 text-[#737373]">
            No lore entries have been created.
          </p>
        </div>
      )}
    </div>
  )
}

export default LoreEntryList