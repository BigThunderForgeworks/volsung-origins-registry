import { useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function CompanyLicenseManager({
  company,
  licenseTypes,
  companyLicenses,
  onChanged,
}) {
  const [selectedLicenseId, setSelectedLicenseId] = useState("")
  const [processingId, setProcessingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [message, setMessage] = useState("")

  const activeOrPendingLicenseIds = companyLicenses
    .filter((license) =>
      ["active", "pending"].includes(license.status)
    )
    .map((license) => license.license_type_id)

  const availableLicenseTypes = licenseTypes.filter(
    (licenseType) =>
      !activeOrPendingLicenseIds.includes(licenseType.id)
  )

  async function requestLicense() {
    if (!selectedLicenseId) {
      setErrorMessage("Select a license to request.")
      return
    }

    setProcessingId("request")
    setErrorMessage("")
    setMessage("")

    const { error } = await supabase.rpc(
      "request_company_license",
      {
        p_company_id: company.id,
        p_license_type_id: selectedLicenseId,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setProcessingId(null)
      return
    }

    setSelectedLicenseId("")
    setMessage("License request submitted.")

    await onChanged()
    setProcessingId(null)
  }

  async function cancelRequest(companyLicenseId) {
    const confirmed = window.confirm(
      "Cancel this pending license request?"
    )

    if (!confirmed) {
      return
    }

    setProcessingId(companyLicenseId)
    setErrorMessage("")
    setMessage("")

    const { error } = await supabase.rpc(
      "cancel_company_license_request",
      {
        p_company_license_id: companyLicenseId,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setProcessingId(null)
      return
    }

    setMessage("License request cancelled.")

    await onChanged()
    setProcessingId(null)
  }

  return (
    <Card
      title="Operating Licenses"
      subtitle="Company commercial authorities"
    >
      {errorMessage && (
        <div className="mb-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}

      {message && (
        <div className="mb-5 border border-green-700 bg-green-900/20 px-5 py-4 text-green-400">
          {message}
        </div>
      )}

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
          Current Licenses
        </p>

        {companyLicenses.length === 0 ? (
          <p className="mt-3 leading-7 text-[#737373]">
            No Company licenses are currently registered.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {companyLicenses.map((license) => {
              const licenseType = license.license_types

              return (
                <div
                  key={license.id}
                  className="flex flex-col gap-4 border border-[#384A59] bg-[#111519] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold uppercase tracking-wider">
                      {licenseType?.name ?? "Unknown License"}
                    </p>

                    <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
                      [{licenseType?.short_name ?? "N/A"}]
                    </p>

                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                      Status: {license.status}
                    </p>
                  </div>

                  {license.status === "pending" && (
                    <Button
                      variant="outline"
                      disabled={processingId === license.id}
                      onClick={() =>
                        cancelRequest(license.id)
                      }
                    >
                      {processingId === license.id
                        ? "Cancelling..."
                        : "Cancel Request"}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="mt-8 border-t border-[#384A59] pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
          Request License
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <select
            value={selectedLicenseId}
            onChange={(event) => {
              setSelectedLicenseId(event.target.value)
              setErrorMessage("")
              setMessage("")
            }}
            className="flex-1 border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
          >
            <option value="">
              Select operating license
            </option>

            {availableLicenseTypes.map((licenseType) => (
              <option
                key={licenseType.id}
                value={licenseType.id}
              >
                {licenseType.name} [{licenseType.short_name}]
              </option>
            ))}
          </select>

          <Button
            disabled={
              processingId === "request" ||
              !selectedLicenseId
            }
            onClick={requestLicense}
          >
            {processingId === "request"
              ? "Submitting..."
              : "Request License"}
          </Button>
        </div>

        {availableLicenseTypes.length === 0 && (
          <p className="mt-4 text-sm text-[#737373]">
            No additional active license types are currently available.
          </p>
        )}
      </section>
    </Card>
  )
}

export default CompanyLicenseManager