import Button from "../../../../components/ui/Button"

const BLOCK_TYPE_OPTIONS = [
  { value: "section", label: "Section" },
  { value: "classified_file", label: "Classified File" },
  { value: "objectives", label: "Objectives List" },
  { value: "quote", label: "Quote" },
  { value: "broadcast", label: "Broadcast" },
  {
    value: "closing_transmission",
    label: "Closing Transmission",
  },
]

function LoreBlockForm({
  block,
  isSaving = false,
  onChange,
  onSave,
  onCancel,
}) {
  function handleChange(event) {
    const { name, value } = event.target

    onChange({
      ...block,
      [name]: name === "sort_order" ? Number(value) : value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave(block)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#99692E] bg-[#111519] p-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="block_type"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Block Type
          </label>

          <select
            id="block_type"
            name="block_type"
            value={block.block_type}
            onChange={handleChange}
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          >
            {BLOCK_TYPE_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="sort_order"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Display Order
          </label>

          <input
            id="sort_order"
            name="sort_order"
            type="number"
            min="0"
            step="10"
            value={block.sort_order}
            onChange={handleChange}
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="heading"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Heading
          </label>

          <input
            id="heading"
            name="heading"
            type="text"
            value={block.heading}
            onChange={handleChange}
            placeholder="I. SECTION TITLE"
            className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none placeholder:text-[#737373] focus:border-[#99692E]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="content"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
          >
            Content
          </label>

          <textarea
            id="content"
            name="content"
            rows="10"
            value={block.content}
            onChange={handleChange}
            placeholder="Enter the complete content for this block."
            className="mt-3 w-full resize-y border border-[#384A59] bg-[#171B1F] px-4 py-3 leading-7 text-[#D9D9D9] outline-none placeholder:text-[#737373] focus:border-[#99692E]"
          />
        </div>

        {block.block_type === "classified_file" && (
          <div className="md:col-span-2">
            <label
              htmlFor="file_code"
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
            >
              Classified File Code
            </label>

            <input
              id="file_code"
              name="file_code"
              type="text"
              value={block.file_code ?? ""}
              onChange={handleChange}
              placeholder="EREBUS-001"
              className="mt-3 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 font-mono text-[#D9D9D9] outline-none placeholder:text-[#737373] focus:border-[#99692E]"
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Block"}
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

export default LoreBlockForm