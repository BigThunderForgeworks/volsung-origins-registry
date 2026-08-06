import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import { supabase } from "../../../lib/supabase"
import LoreBlockRenderer from "../LoreBlockRenderer"
import LoreBlockForm from "./blocks/LoreBlockForm"

function createEmptyBlock(sortOrder = 10) {
  return {
    id: null,
    block_type: "section",
    sort_order: sortOrder,
    heading: "",
    content: "",
    file_code: "",
    metadata: {},
  }
}

function LoreBlockEditor({ entry }) {
  const [blocks, setBlocks] = useState([])
  const [editingBlock, setEditingBlock] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadBlocks()
  }, [entry.id])

  async function loadBlocks() {
    setIsLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase
      .from("lore_blocks")
      .select(`
        id,
        lore_entry_id,
        block_type,
        sort_order,
        heading,
        content,
        metadata
      `)
      .eq("lore_entry_id", entry.id)
      .order("sort_order", { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setBlocks(data ?? [])
    setIsLoading(false)
  }

  function getNextSortOrder() {
    if (blocks.length === 0) {
      return 10
    }

    return (
      Math.max(...blocks.map((block) => block.sort_order)) + 10
    )
  }

  function handleCreateBlock() {
    setMessage("")
    setErrorMessage("")
    setEditingBlock(createEmptyBlock(getNextSortOrder()))
  }

  function handleEditBlock(block) {
    setMessage("")
    setErrorMessage("")

    setEditingBlock({
      ...block,
      file_code: block.metadata?.file_code ?? "",
    })
  }

  async function handleSaveBlock(blockValues) {
    const heading = blockValues.heading.trim() || null
    const content = blockValues.content.trim()

    if (!content) {
      setErrorMessage("Block content is required.")
      return
    }

    setIsSaving(true)
    setMessage("")
    setErrorMessage("")

    const metadata =
      blockValues.block_type === "classified_file"
        ? {
            ...blockValues.metadata,
            file_code: blockValues.file_code.trim() || null,
            classification_label: "CLASSIFIED DATA FILE",
          }
        : blockValues.metadata ?? {}

    const payload = {
      lore_entry_id: entry.id,
      block_type: blockValues.block_type,
      sort_order: blockValues.sort_order,
      heading,
      content,
      metadata,
    }

    let savedBlock = null
    let saveError = null

    if (blockValues.id) {
      const { data, error } = await supabase
        .from("lore_blocks")
        .update(payload)
        .eq("id", blockValues.id)
        .select()
        .single()

      savedBlock = data
      saveError = error
    } else {
      const { data, error } = await supabase
        .from("lore_blocks")
        .insert(payload)
        .select()
        .single()

      savedBlock = data
      saveError = error
    }

    if (saveError) {
      setErrorMessage(saveError.message)
      setIsSaving(false)
      return
    }

    setBlocks((currentBlocks) => {
      const updatedBlocks = blockValues.id
        ? currentBlocks.map((block) =>
            block.id === savedBlock.id ? savedBlock : block
          )
        : [...currentBlocks, savedBlock]

      return updatedBlocks.sort(
        (firstBlock, secondBlock) =>
          firstBlock.sort_order - secondBlock.sort_order
      )
    })

    setEditingBlock(null)
    setMessage(
      blockValues.id
        ? "Lore block updated."
        : "Lore block created."
    )
    setIsSaving(false)
  }

  async function handleDeleteBlock(block) {
    const confirmed = window.confirm(
      `Delete "${block.heading ?? "Untitled Block"}"?`
    )

    if (!confirmed) {
      return
    }

    setMessage("")
    setErrorMessage("")

    const { error } = await supabase
      .from("lore_blocks")
      .delete()
      .eq("id", block.id)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setBlocks((currentBlocks) =>
      currentBlocks.filter(
        (currentBlock) => currentBlock.id !== block.id
      )
    )

    if (editingBlock?.id === block.id) {
      setEditingBlock(null)
    }

    setMessage("Lore block deleted.")
  }

  if (isLoading) {
    return (
      <div className="mt-6 border border-[#384A59] bg-[#171B1F] p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#99692E]">
          Loading lore content blocks
        </p>
      </div>
    )
  }

  return (
    <section className="mt-6 border border-[#384A59] bg-[#171B1F] p-6">
      <div className="flex flex-col gap-4 border-b border-[#384A59] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
            Lore Content Blocks
          </p>

          <p className="mt-3 leading-7 text-[#737373]">
            Add and arrange the sections that make up this archive record.
          </p>
        </div>

        <Button
          onClick={handleCreateBlock}
          disabled={Boolean(editingBlock)}
        >
          Add Content Block
        </Button>
      </div>

      {editingBlock && (
        <div className="mt-6">
          <LoreBlockForm
            block={editingBlock}
            isSaving={isSaving}
            onChange={setEditingBlock}
            onSave={handleSaveBlock}
            onCancel={() => setEditingBlock(null)}
          />
        </div>
      )}

      <div className="mt-8 space-y-6">
        {blocks.length > 0 ? (
          blocks.map((block) => (
            <div
              key={block.id}
              className="border border-[#384A59] bg-[#111519] p-5"
            >
              <div className="mb-5 flex flex-col gap-4 border-b border-[#384A59] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                    {block.block_type.replaceAll("_", " ")}
                    {" // "}
                    Order {block.sort_order}
                  </p>

                  <p className="mt-2 font-bold uppercase tracking-wider">
                    {block.heading ?? "Untitled Block"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleEditBlock(block)}
                    disabled={Boolean(editingBlock)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleDeleteBlock(block)}
                    disabled={Boolean(editingBlock)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <LoreBlockRenderer block={block} />
            </div>
          ))
        ) : (
          <div className="border border-[#384A59] bg-[#111519] p-6">
            <p className="leading-7 text-[#737373]">
              This lore entry does not have any content blocks yet.
            </p>
          </div>
        )}
      </div>

      {message && (
        <div className="mt-6 border border-green-700 bg-green-900/20 px-5 py-4 text-green-400">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="mt-6 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}
    </section>
  )
}

export default LoreBlockEditor