import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

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

  const [logoFile, setLogoFile] = useState(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const [successMessage, setSuccessMessage] = useState("")
  const [localError, setLocalError] = useState("")

  useEffect(() => {
    setFormData({
      description: company.description ?? "",
      logoUrl: company.logo_url ?? "",
      foundedDate: company.founded_date ?? "",
      motto: company.motto ?? "",
      primaryColor: company.primary_color ?? "",
      secondaryColor: company.secondary_color ?? "",
    })

    setLogoFile(null)
    setLogoPreviewUrl(company.logo_url ?? "")
    setLocalError("")
  }, [company])

  function handleChange(event) {
    const { name, value } = event.target

    setSuccessMessage("")
    setLocalError("")

    if (onChange) {
      onChange()
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleLogoChange(event) {
    const file = event.target.files?.[0] ?? null

    setSuccessMessage("")
    setLocalError("")

    if (onChange) {
      onChange()
    }

    if (!file) {
      setLogoFile(null)
      setLogoPreviewUrl(formData.logoUrl || "")
      return
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      setLocalError(
        "Company logo must be a PNG, JPG, JPEG, or WEBP image."
      )
      event.target.value = ""
      return
    }

    const maxFileSize = 5 * 1024 * 1024

    if (file.size > maxFileSize) {
      setLocalError(
        "Company logo must be 5 MB or smaller."
      )
      event.target.value = ""
      return
    }

    setLogoFile(file)
    setLogoPreviewUrl(URL.createObjectURL(file))
  }

  async function uploadCompanyLogo() {
    if (!logoFile) {
      return formData.logoUrl || null
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error(
        userError?.message ??
          "You must be signed in to upload a Company logo."
      )
    }

    const extension =
      logoFile.name
        .split(".")
        .pop()
        ?.toLowerCase() || "png"

    const filePath =
      `${user.id}/${company.id}/${crypto.randomUUID()}.${extension}`

    const { error: uploadError } =
      await supabase.storage
        .from("company-logos")
        .upload(filePath, logoFile, {
          cacheControl: "3600",
          upsert: false,
        })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from("company-logos")
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSuccessMessage("")
    setLocalError("")

    try {
      setIsUploading(true)

      const logoUrl = await uploadCompanyLogo()

      const success = await onSave({
        ...formData,
        logoUrl: logoUrl ?? "",
      })

      if (success) {
        setLogoFile(null)

        setFormData((current) => ({
          ...current,
          logoUrl: logoUrl ?? "",
        }))

        setLogoPreviewUrl(logoUrl ?? "")
        setSuccessMessage("Company profile updated.")
      }
    } catch (error) {
      setLocalError(
        error?.message ??
          "Unable to upload the Company logo."
      )
    } finally {
      setIsUploading(false)
    }
  }

  const isBusy = isSaving || isUploading

  return (
    <Card
      title="Company Profile"
      subtitle="Public registry information"
    >
      <form
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {localError && (
          <div className="border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
            {localError}
          </div>
        )}

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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
            Company Logo
          </p>

          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center border border-[#384A59] bg-[#111519]">
              {logoPreviewUrl ? (
                <img
                  src={logoPreviewUrl}
                  alt={`${company.name} logo preview`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="px-3 text-center text-xs uppercase tracking-[0.2em] text-[#737373]">
                  No Logo
                </span>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="companyLogo"
                className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9D9D9]"
              >
                Upload Logo
              </label>

              <input
                id="companyLogo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={isBusy}
                onChange={handleLogoChange}
                className="mt-2 block w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-sm text-[#D9D9D9] file:mr-4 file:border-0 file:bg-[#384A59] file:px-4 file:py-2 file:font-bold file:uppercase file:tracking-wider file:text-[#D9D9D9]"
              />

              <p className="mt-2 text-xs leading-5 text-[#737373]">
                PNG, JPG, JPEG, or WEBP. Maximum file size: 5 MB.
              </p>

              {logoFile && (
                <p className="mt-2 text-sm text-[#99692E]">
                  Selected: {logoFile.name}
                </p>
              )}
            </div>
          </div>
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
            disabled={isBusy}
          >
            {isUploading
              ? "Uploading Logo..."
              : isSaving
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