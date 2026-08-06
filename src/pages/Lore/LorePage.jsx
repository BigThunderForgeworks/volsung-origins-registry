import { useEffect, useState } from "react"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"
import LoreEntryCard from "./components/LoreEntryCard"

function LorePage() {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadLoreEntries()
  }, [])

  async function loadLoreEntries() {
    setIsLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase
      .from("lore_entries")
      .select(`
        id,
        entry_number,
        title,
        slug,
        document_type,
        classification,
        target_system,
        summary,
        is_featured,
        published_at
      `)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("entry_number", { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setEntries(data ?? [])
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Accessing Historical Archive
            </p>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#171B1F] text-[#D9D9D9]">
      <section className="border-b border-[#384A59] bg-[#1D2328] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Historical & Operations Division
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider sm:text-6xl">
            Lore Compendium
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#737373]">
            Published deployment records, historical reports, transmissions,
            and recovered files documenting the Erebus frontier.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {errorMessage && (
            <div className="mb-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
              {errorMessage}
            </div>
          )}

          {entries.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {entries.map((entry) => (
                <LoreEntryCard
                  key={entry.id}
                  entry={entry}
                />
              ))}
            </div>
          ) : (
            <Card
              title="No Published Records"
              subtitle="Historical archive"
            >
              <p className="leading-7 text-[#737373]">
                There are currently no public lore records available.
              </p>
            </Card>
          )}
        </div>
      </section>
    </main>
  )
}

export default LorePage