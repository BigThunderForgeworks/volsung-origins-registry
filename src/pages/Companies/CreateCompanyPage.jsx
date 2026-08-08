import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import CompanyForm from "./components/CompanyForm"
import useCreateCompany from "./hooks/useCreateCompany"

function CreateCompanyPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    description: "",
    logoUrl: "",
    foundedDate: "",
    motto: "",
    primaryColor: "",
    secondaryColor: "",
    factionId: "",
    recruiting: true,
  })

  const [selectedLicenseIds, setSelectedLicenseIds] = useState([])

  const {
    licenseTypes,
    availableFactions,
    isLoading,
    isSubmitting,
    errorMessage,
    submitError,
    submitCompany,
    clearSubmitError,
  } = useCreateCompany()

  function handleFormChange(values) {
    setFormData(values)
    clearSubmitError()
  }

  function handleToggleLicense(licenseId) {
    clearSubmitError()

    setSelectedLicenseIds((current) => {
      if (current.includes(licenseId)) {
        return current.filter((id) => id !== licenseId)
      }

      if (current.length >= 2) {
        return current
      }

      return [...current, licenseId]
    })
  }

  async function handleSubmit() {
    const companyId = await submitCompany({
      formData,
      selectedLicenseIds,
    })

    if (!companyId) {
      return
    }

    navigate(
      `/companies/${formData.shortName.trim().toUpperCase()}`
    )
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Company Registration
            </p>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 border-b border-[#384A59] pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Volsung Origins Corporate Registry
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
            Register Company
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-[#737373]">
            Establish a new Company, select its operating licenses, and
            determine whether it will operate independently or beneath an
            existing Faction.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
            {errorMessage}
          </div>
        )}

        <Card>
          <CompanyForm
            formData={formData}
            onChange={handleFormChange}
            licenseTypes={licenseTypes}
            selectedLicenseIds={selectedLicenseIds}
            onToggleLicense={handleToggleLicense}
            availableFactions={availableFactions}
          />
        </Card>

        <Card className="mt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
                Company Registration
              </p>

              <p className="mt-2 max-w-2xl leading-7 text-[#737373]">
                Review the Company information and operating licenses before
                submitting the registration.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => navigate("/companies")}
              >
                Cancel
              </Button>

              <Button
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting
                  ? "Registering..."
                  : "Register Company"}
              </Button>
            </div>
          </div>

          {submitError && (
            <div className="mt-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
              {submitError}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}

export default CreateCompanyPage