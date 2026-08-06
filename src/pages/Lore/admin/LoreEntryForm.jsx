import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"

const DEFAULT_FORM_VALUES = {
  entry_number: 1,
  title: "",
  slug: "",
  series_title: "VOLSUNG ORIGINS: SECTOR 2",
  document_type: "LORE COMPENDIUM",
  classification: "OPEN DEPLOYMENT RECORD / SECTOR BROADCAST",
  recording_entity:
    "VOLSUNG INDUSTRIES HISTORICAL & OPERATIONS DIVISION",
  target_system: "",
  summary: "",
  status: "draft",
  is_featured: false,
}

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function LoreEntryForm({
  initialEntry = null,
  suggestedEntryNumber = 1,
  isSaving = false,
  onCancel,
  onSave,
}) {
  const [formValues, setFormValues] = useState({
    ...DEFAULT_FORM_VALUES,
    entry_number: suggestedEntryNumber,
  })

  const [slugWasEdited, setSlugWasEdited] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (initialEntry) {
      setFormValues({
        entry_number: initialEntry.entry_number ?? suggestedEntryNumber,
        title: initialEntry.title ?? "",
        slug: initialEntry.slug ?? "",
        series_title:
          initialEntry.series_title ??
          DEFAULT_FORM_VALUES.series_title,
        document_type:
          initialEntry.document_type ??
          DEFAULT_FORM_VALUES.document_type,
        classification:
          initialEntry.classification ??
          DEFAULT_FORM_VALUES.classification,
        recording_entity:
          initialEntry.recording_entity ??
          DEFAULT_FORM_VALUES.recording_entity,
        target_system: initialEntry.target_system ?? "",
        summary: initialEntry.summary ?? "",
        status: initialEntry.status ?? "draft",
        is_featured: initialEntry.is_featured ?? false,
      })

      setSlugWasEdited(true)
      return
    }

    setFormValues({
      ...DEFAULT_FORM_VALUES,
      entry_number: suggestedEntryNumber,
    })

    setSlugWasEdited(false)
  }, [initialEntry, suggestedEntryNumber])

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (name === "title" && !slugWasEdited) {
      setFormValues((currentValues) => ({
        ...currentValues,
        title: value,
        slug: createSlug(value),
      }))
    }

    if (name === "slug") {
      setSlugWasEdited(true)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage("")

    const cleanedValues = {
      ...formValues,
      entry_number: Number(formValues.entry_number),
      title: formValues.title.trim(),
      slug: createSlug(formValues.slug),
      series_title: formValues.series_title.trim(),
      document_type: formValues.document_type.trim(),
      classification: formValues.classification.trim(),
      recording_entity: formValues.recording_entity.trim(),
      target_system: formValues.target_system.trim() || null,
      summary: formValues.summary.trim(),
    }

    if (!cleanedValues.entry_number || cleanedValues.entry_number < 1) {
      setErrorMessage("Entry number must be 1 or greater.")
      return
    }

    if (!cleanedValues.title) {
      setErrorMessage("Enter a lore title.")
      return
    }

    if (!cleanedValues.slug) {
      setErrorMessage("Enter a valid lore slug.")
      return
    }

    if (cleanedValues.summary.length < 10) {
      setErrorMessage(
        "The public summary must contain at least 10 characters."
      )
      return
    }

    onSave(cleanedValues)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border border-[#99692E] bg-[#111519] p-6"
    >
      <div className="border-b border-[#384A59] pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E]">
          Lore Record Composer
        </p>

        <h3 className="mt-3 text-2xl font-bold uppercase tracking-wider text-[#D9D9D9]">
          {initialEntry ? "Edit Lore Entry" : "Create Lore Entry"}
        </h3>

        <p className="mt-3 leading-7 text-[#737373]">
          Complete the record information first. Lore sections and special
          content blocks will be added after the entry is saved.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="entry_number"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Entry Number
          </label>

          <input
            id="entry_number"
            name="entry_number"
            type="number"
            min="1"
            value={formValues.entry_number}
            onChange={handleChange}
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={formValues.status}
            onChange={handleChange}
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          >
            <option value="draft">Draft</option>
            <option value="queued">Queued</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="title"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Entry Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formValues.title}
            onChange={handleChange}
            placeholder="THE EREBUS INITIATIVE"
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none placeholder:text-[#737373] focus:border-[#99692E]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="slug"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            URL Slug
          </label>

          <input
            id="slug"
            name="slug"
            type="text"
            value={formValues.slug}
            onChange={handleChange}
            placeholder="the-erebus-initiative"
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 font-mono text-[#D9D9D9] outline-none placeholder:text-[#737373] focus:border-[#99692E]"
          />
        </div>

        <div>
          <label
            htmlFor="series_title"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Series Title
          </label>

          <input
            id="series_title"
            name="series_title"
            type="text"
            value={formValues.series_title}
            onChange={handleChange}
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div>
          <label
            htmlFor="document_type"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Document Type
          </label>

          <input
            id="document_type"
            name="document_type"
            type="text"
            value={formValues.document_type}
            onChange={handleChange}
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="classification"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Classification
          </label>

          <input
            id="classification"
            name="classification"
            type="text"
            value={formValues.classification}
            onChange={handleChange}
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="recording_entity"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Recording Entity
          </label>

          <input
            id="recording_entity"
            name="recording_entity"
            type="text"
            value={formValues.recording_entity}
            onChange={handleChange}
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="target_system"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Target System or Region
          </label>

          <input
            id="target_system"
            name="target_system"
            type="text"
            value={formValues.target_system}
            onChange={handleChange}
            placeholder={'REGION 074-E ("EREBUS SYSTEM")'}
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none placeholder:text-[#737373] focus:border-[#99692E]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="summary"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Public Summary
          </label>

          <textarea
            id="summary"
            name="summary"
            value={formValues.summary}
            onChange={handleChange}
            rows="5"
            placeholder="A short public description displayed in the lore archive."
            className="mt-3 w-full resize-y border border-[#384A59] bg-[#171B1F] px-4 py-3 leading-7 text-[#D9D9D9] outline-none placeholder:text-[#737373] focus:border-[#99692E]"
          />
        </div>

        <label className="flex items-center gap-3 md:col-span-2">
          <input
            name="is_featured"
            type="checkbox"
            checked={formValues.is_featured}
            onChange={handleChange}
            className="h-4 w-4 accent-[#99692E]"
          />

          <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#D9D9D9]">
            Feature this record in the lore archive
          </span>
        </label>
      </div>

      {errorMessage && (
        <div className="mt-6 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : initialEntry
              ? "Save Lore Entry"
              : "Create Lore Entry"}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default LoreEntryForm