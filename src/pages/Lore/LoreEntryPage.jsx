import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"
import LoreBlockRenderer from "./LoreBlockRenderer"
import LoreEntryHeader from "./components/LoreEntryHeader"
import LoreEntryNavigation from "./components/LoreEntryNavigation"

function LoreEntryPage() {
  const navigate = useNavigate()
  const { loreSlug } = useParams()

  const [entry, setEntry] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [previousEntry, setPreviousEntry] = useState(null)
  const [nextEntry, setNextEntry] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadEntry()
  }, [loreSlug])

  async function loadEntry() {
    setIsLoading(true)
    setErrorMessage("")
    setEntry(null)
    setBlocks([])
    setPreviousEntry(null)
    setNextEntry(null)

    const currentTimestamp = new Date().toISOString()

    const { data: entryRecord, error: entryError } =
      await supabase
        .from("lore_entries")
        .select(`
          id,
          entry_number,
          title,
          slug,
          series_title,
          document_type,
          classification,
          recording_entity,
          target_system,
          summary,
          is_featured,
          published_at
        `)
        .eq("slug", loreSlug)
        .eq("status", "published")
        .lte("published_at", currentTimestamp)
        .maybeSingle()

    if (entryError) {
      setErrorMessage(entryError.message)
      setIsLoading(false)
      return
    }

    if (!entryRecord) {
      navigate("/lore")
      return
    }

    const [
      { data: blockRecords, error: blockError },
      {
        data: previousEntryRecord,
        error: previousEntryError,
      },
      {
        data: nextEntryRecord,
        error: nextEntryError,
      },
    ] = await Promise.all([
      supabase
        .from("lore_blocks")
        .select(`
          id,
          block_type,
          sort_order,
          heading,
          content,
          metadata
        `)
        .eq("lore_entry_id", entryRecord.id)
        .order("sort_order", { ascending: true }),

      supabase
        .from("lore_entries")
        .select("entry_number, title, slug")
        .eq("status", "published")
        .lte("published_at", currentTimestamp)
        .lt("entry_number", entryRecord.entry_number)
        .order("entry_number", { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from("lore_entries")
        .select("entry_number, title, slug")
        .eq("status", "published")
        .lte("published_at", currentTimestamp)
        .gt("entry_number", entryRecord.entry_number)
        .order("entry_number", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ])

    const firstError =
      blockError ||
      previousEntryError ||
      nextEntryError

    if (firstError) {
      setErrorMessage(firstError.message)
      setIsLoading(false)
      return
    }

    setEntry(entryRecord)
    setBlocks(blockRecords ?? [])
    setPreviousEntry(previousEntryRecord ?? null)
    setNextEntry(nextEntryRecord ?? null)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-4xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Decrypting Historical Record
            </p>
          </Card>
        </div>
      </main>
    )
  }

  if (!entry) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <article className="mx-auto max-w-4xl">
        <Button
          variant="outline"
          onClick={() => navigate("/lore")}
        >
          Return to Lore Archive
        </Button>

        <LoreEntryNavigation
          previousEntry={previousEntry}
          nextEntry={nextEntry}
          className="mt-8"
        />

        <LoreEntryHeader entry={entry} />

        {errorMessage && (
          <div className="mt-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
            {errorMessage}
          </div>
        )}

        <div className="mt-10 space-y-10">
          {blocks.map((block) => (
            <LoreBlockRenderer
              key={block.id}
              block={block}
            />
          ))}
        </div>

        <LoreEntryNavigation
          previousEntry={previousEntry}
          nextEntry={nextEntry}
          className="mt-12"
        />
      </article>
    </main>
  )
}

export default LoreEntryPage