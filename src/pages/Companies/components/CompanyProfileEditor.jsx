import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"

function CompanyProfileEditor({
  company,
  isSaving,
  onSave,
  onChange,
}) {
  const [formData, setFormData] = useState({
    description: "",
    logoUrl: "",
    foundedDate: "",
    motto: "",
    primaryColor: "",
    secondaryColor: "",
  })

  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    setFormData({
      description: company.description ?? "",
      logoUrl: company.logo_url ?? "",
      foundedDate: company.founded_date ?? "",
      motto: company.motto ?? "",
      primaryColor: company.primary_color ?? "",
      secondaryColor: company.secondary_color ?? "",
    })
  }, [company])

  function handleChange(event) {
    const { name, value } = event.target

    setSuccessMessage("")

    if (onChange) {
      onChange()
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSuccessMessage("")

    const success = await onSave(formData)

    if (success) {
      setSuccessMessage("Company profile updated.")
    }
  }

  return (
    <Card
      title="Company Profile"
      subtitle="Public registry information"
    >
      <form
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="description"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div>
          <label
            htmlFor="motto"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]"
          >
            Motto
          </label>

          <input
            id="motto"
            name="motto"
            type="text"
            value={formData.motto}
            onChange={handleChange}
            className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div>
          <label
            htmlFor="foundedDate"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]"
          >
            Founded Date
          </label>

          <input
            id="foundedDate"
            name="foundedDate"
            type="date"
            value={formData.foundedDate}
            onChange={handleChange}
            className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div>
          <label
            htmlFor="logoUrl"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]"
          >
            Logo URL
          </label>

          <input
            id="logoUrl"
            name="logoUrl"
            type="url"
            value={formData.logoUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="primaryColor"
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]"
            >
              Primary Color
            </label>

            <input
              id="primaryColor"
              name="primaryColor"
              type="text"
              maxLength={7}
              value={formData.primaryColor}
              onChange={handleChange}
              placeholder="#384A59"
              className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
            />
          </div>

          <div>
            <label
              htmlFor="secondaryColor"
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]"
            >
              Secondary Color
            </label>

            <input
              id="secondaryColor"
              name="secondaryColor"
              type="text"
              maxLength={7}
              value={formData.secondaryColor}
              onChange={handleChange}
              placeholder="#737373"
              className="mt-2 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : "Save Company Profile"}
          </Button>

          {successMessage && (
            <p className="text-sm text-[#99692E]">
              {successMessage}
            </p>
          )}
        </div>
      </form>
    </Card>
  )
}

export default CompanyProfileEditor