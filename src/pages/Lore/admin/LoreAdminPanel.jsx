import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"
import LoreBlockEditor from "./LoreBlockEditor"
import LoreEntryForm from "./LoreEntryForm"
import LoreEntryList from "./LoreEntryList"

function LoreAdminPanel() {
  const [entries, setEntries] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(null)

  const [isCreatingEntry, setIsCreatingEntry] = useState(false)
  const [isEditingEntry, setIsEditingEntry] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [message, setMessage] = useState("")
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
        series_title,
        document_type,
        classification,
        recording_entity,
        target_system,
        summary,
        status,
        is_featured,
        submitted_by,
        published_by,
        published_at,
        created_at,
        updated_at
      `)
      .order("entry_number", { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setEntries(data ?? [])
    setIsLoading(false)
  }

  function getSuggestedEntryNumber() {
    if (entries.length === 0) {
      return 1
    }

    return (
      Math.max(
        ...entries.map((entry) => entry.entry_number ?? 0)
      ) + 1
    )
  }

  function handleCreateEntry() {
    setMessage("")
    setErrorMessage("")
    setSelectedEntry(null)
    setIsCreatingEntry(true)
    setIsEditingEntry(false)
  }

  function handleSelectEntry(entry) {
    setMessage("")
    setErrorMessage("")

    const isAlreadySelected = selectedEntry?.id === entry.id

    setSelectedEntry(isAlreadySelected ? null : entry)
    setIsCreatingEntry(false)
    setIsEditingEntry(false)
  }

  function handleEditEntry() {
    setMessage("")
    setErrorMessage("")
    setIsCreatingEntry(false)
    setIsEditingEntry(true)
  }

  function handleCancelForm() {
    setIsCreatingEntry(false)
    setIsEditingEntry(false)
    setMessage("")
    setErrorMessage("")
  }

  async function handleSaveEntry(formValues) {
    setIsSaving(true)
    setMessage("")
    setErrorMessage("")

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setErrorMessage(
        userError?.message ??
          "You must be signed in to manage lore entries."
      )
      setIsSaving(false)
      return
    }

    const isUpdating = Boolean(selectedEntry) && !isCreatingEntry
    const isPublishing = formValues.status === "published"

    const entryPayload = {
      entry_number: formValues.entry_number,
      title: formValues.title,
      slug: formValues.slug,
      series_title: formValues.series_title,
      document_type: formValues.document_type,
      classification: formValues.classification,
      recording_entity: formValues.recording_entity,
      target_system: formValues.target_system,
      summary: formValues.summary,
      status: formValues.status,
      is_featured: formValues.is_featured,
      published_by: isPublishing
        ? selectedEntry?.published_by ?? user.id
        : null,
      published_at: isPublishing
        ? selectedEntry?.published_at ??
          new Date().toISOString()
        : null,
      updated_at: new Date().toISOString(),
    }

    let savedEntry = null
    let saveError = null

    if (isUpdating) {
      const { data, error } = await supabase
        .from("lore_entries")
        .update(entryPayload)
        .eq("id", selectedEntry.id)
        .select()
        .single()

      savedEntry = data
      saveError = error
    } else {
      const { data, error } = await supabase
        .from("lore_entries")
        .insert({
          ...entryPayload,
          submitted_by: user.id,
        })
        .select()
        .single()

      savedEntry = data
      saveError = error
    }

    if (saveError) {
      setErrorMessage(saveError.message)
      setIsSaving(false)
      return
    }

    setEntries((currentEntries) => {
      const updatedEntries = isUpdating
        ? currentEntries.map((entry) =>
            entry.id === savedEntry.id
              ? savedEntry
              : entry
          )
        : [...currentEntries, savedEntry]

      return updatedEntries.sort(
        (firstEntry, secondEntry) =>
          firstEntry.entry_number -
          secondEntry.entry_number
      )
    })

    setSelectedEntry(savedEntry)
    setIsCreatingEntry(false)
    setIsEditingEntry(false)
    setIsSaving(false)

    setMessage(
      isUpdating
        ? "Lore entry updated."
        : "Lore entry created. You can now add its content blocks."
    )
  }

  return (
    <Card
      title="Lore Administration"
      subtitle="Historical record management"
    >
      {isLoading ? (
        <p className="text-sm uppercase tracking-[0.25em] text-[#99692E]">
          Accessing lore records
        </p>
      ) : errorMessage && entries.length === 0 ? (
        <div className="border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      ) : (
        <>
          <LoreEntryList
            entries={entries}
            selectedEntryId={selectedEntry?.id ?? null}
            onCreateEntry={handleCreateEntry}
            onSelectEntry={handleSelectEntry}
          />

          {isCreatingEntry && (
            <LoreEntryForm
              initialEntry={null}
              suggestedEntryNumber={getSuggestedEntryNumber()}
              isSaving={isSaving}
              onCancel={handleCancelForm}
              onSave={handleSaveEntry}
            />
          )}

          {selectedEntry && !isCreatingEntry && !isEditingEntry && (
            <>
              <div className="mt-6 flex flex-col gap-4 border border-[#384A59] bg-[#171B1F] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
                    Selected Lore Record
                  </p>

                  <h3 className="mt-3 text-xl font-bold uppercase tracking-wider text-[#D9D9D9]">
                    {selectedEntry.title}
                  </h3>

                  <p className="mt-2 text-sm uppercase tracking-wider text-[#737373]">
                    Status: {selectedEntry.status}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={handleEditEntry}
                >
                  Edit Record Details
                </Button>
              </div>

              <LoreBlockEditor entry={selectedEntry} />
            </>
          )}

          {selectedEntry && isEditingEntry && (
            <LoreEntryForm
              initialEntry={selectedEntry}
              suggestedEntryNumber={selectedEntry.entry_number}
              isSaving={isSaving}
              onCancel={handleCancelForm}
              onSave={handleSaveEntry}
            />
          )}
        </>
      )}

      {message && (
        <div className="mt-6 border border-green-700 bg-green-900/20 px-5 py-4 text-green-400">
          {message}
        </div>
      )}

      {errorMessage && entries.length > 0 && (
        <div className="mt-6 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}
    </Card>
  )
}

export default LoreAdminPanel