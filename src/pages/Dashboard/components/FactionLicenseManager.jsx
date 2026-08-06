import { useEffect, useMemo, useState } from "react"
import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"
import { supabase } from "../../../lib/supabase"

const MAX_LICENSES = 2

function FactionLicenseManager({ factionId, isFactionOwner }) {
  const [licenseRecords, setLicenseRecords] = useState([])
  const [licenseTypes, setLicenseTypes] = useState([])
  const [selectedLicenseTypeId, setSelectedLicenseTypeId] =
    useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)
  const [cancellingRequestId, setCancellingRequestId] =
    useState(null)

  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadLicenses()
  }, [factionId])

  async function loadLicenses() {
    setIsLoading(true)
    setMessage("")
    setErrorMessage("")

    const [
      { data: factionLicenseRecords, error: factionLicenseError },
      { data: licenseTypeRecords, error: licenseTypeError },
    ] = await Promise.all([
      supabase
        .from("faction_licenses")
        .select(`
          id,
          faction_id,
          license_type_id,
          status,
          created_at,
          license_types (
            id,
            name,
            short_name,
            slug
          )
        `)
        .eq("faction_id", factionId)
        .order("created_at", { ascending: true }),

      supabase
        .from("license_types")
        .select(`
          id,
          name,
          short_name,
          slug,
          status
        `)
        .eq("status", "active")
        .order("name", { ascending: true }),
    ])

    const firstError =
      factionLicenseError || licenseTypeError

    if (firstError) {
      setErrorMessage(firstError.message)
      setIsLoading(false)
      return
    }

    setLicenseRecords(factionLicenseRecords ?? [])
    setLicenseTypes(licenseTypeRecords ?? [])
    setIsLoading(false)
  }

  const activeLicenses = useMemo(
    () =>
      licenseRecords.filter(
        (licenseRecord) => licenseRecord.status === "active"
      ),
    [licenseRecords]
  )

  const pendingLicenses = useMemo(
    () =>
      licenseRecords.filter(
        (licenseRecord) => licenseRecord.status === "pending"
      ),
    [licenseRecords]
  )

  const countedLicenseTotal =
    activeLicenses.length + pendingLicenses.length

  const hasReachedLimit =
    countedLicenseTotal >= MAX_LICENSES

  const unavailableLicenseTypeIds = new Set(
    licenseRecords
      .filter((licenseRecord) =>
        ["active", "pending"].includes(licenseRecord.status)
      )
      .map((licenseRecord) => licenseRecord.license_type_id)
  )

  const availableLicenseTypes = licenseTypes.filter(
    (licenseType) =>
      !unavailableLicenseTypeIds.has(licenseType.id)
  )

  async function handleRequestLicense(event) {
    event.preventDefault()

    setMessage("")
    setErrorMessage("")

    if (!selectedLicenseTypeId) {
      setErrorMessage("Select a license to request.")
      return
    }

    if (hasReachedLimit) {
      setErrorMessage(
        "Your faction already has two active or pending licenses."
      )
      return
    }

    setIsRequesting(true)

    const { error } = await supabase.rpc(
      "request_faction_license",
      {
        p_license_type_id: selectedLicenseTypeId,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setIsRequesting(false)
      return
    }

    setSelectedLicenseTypeId("")
    setMessage("License request submitted for administrator review.")
    setIsRequesting(false)

    await loadLicenses()
  }

  async function handleCancelRequest(licenseRecord) {
    const licenseName =
      licenseRecord.license_types?.name ?? "this license"

    const confirmed = window.confirm(
      `Cancel the pending request for ${licenseName}?`
    )

    if (!confirmed) {
      return
    }

    setMessage("")
    setErrorMessage("")
    setCancellingRequestId(licenseRecord.id)

    const { error } = await supabase.rpc(
      "cancel_faction_license_request",
      {
        p_faction_license_id: licenseRecord.id,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setCancellingRequestId(null)
      return
    }

    setLicenseRecords((currentRecords) =>
      currentRecords.map((currentRecord) =>
        currentRecord.id === licenseRecord.id
          ? {
              ...currentRecord,
              status: "cancelled",
            }
          : currentRecord
      )
    )

    setMessage("Pending license request cancelled.")
    setCancellingRequestId(null)
  }

  if (isLoading) {
    return (
      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#99692E]">
          Loading license records
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 border-t border-[#384A59] pt-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
          Operating Licenses
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          {activeLicenses.length > 0 ? (
            activeLicenses.map((licenseRecord) => (
              <Badge
                key={licenseRecord.id}
                variant="success"
              >
                {licenseRecord.license_types?.name ??
                  "Unknown License"}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-[#737373]">
              No approved licenses assigned.
            </span>
          )}
        </div>
      </div>

      {isFactionOwner && (
        <>
          <div className="mt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                  Pending License Requests
                </p>

                <p className="mt-2 text-sm text-[#737373]">
                  {countedLicenseTotal} of {MAX_LICENSES} active or
                  pending license slots are currently in use.
                </p>
              </div>
            </div>

            {pendingLicenses.length > 0 ? (
              <div className="mt-4 space-y-3">
                {pendingLicenses.map((licenseRecord) => {
                  const isCancelling =
                    cancellingRequestId === licenseRecord.id

                  return (
                    <div
                      key={licenseRecord.id}
                      className="flex flex-col gap-4 border border-[#384A59] bg-[#111519] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <Badge variant="gold">
                          Pending
                        </Badge>

                        <p className="mt-3 font-bold">
                          {licenseRecord.license_types?.name ??
                            "Unknown License"}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        disabled={isCancelling}
                        onClick={() =>
                          handleCancelRequest(licenseRecord)
                        }
                      >
                        {isCancelling
                          ? "Cancelling..."
                          : "Cancel Request"}
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#737373]">
                No license requests are awaiting review.
              </p>
            )}
          </div>

          <form
            className="mt-8 border border-[#384A59] bg-[#111519] p-5"
            onSubmit={handleRequestLicense}
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
              Request Additional License
            </p>

            {hasReachedLimit ? (
              <p className="mt-3 leading-7 text-[#737373]">
                Your faction has reached the two-license limit.
                Cancel a pending request before submitting another.
              </p>
            ) : availableLicenseTypes.length > 0 ? (
              <>
                <select
                  value={selectedLicenseTypeId}
                  onChange={(event) =>
                    setSelectedLicenseTypeId(event.target.value)
                  }
                  className="mt-4 w-full border border-[#384A59] bg-[#171B1F] px-4 py-3 text-[#D9D9D9] outline-none focus:border-[#99692E]"
                >
                  <option value="">
                    Select a license
                  </option>

                  {availableLicenseTypes.map((licenseType) => (
                    <option
                      key={licenseType.id}
                      value={licenseType.id}
                    >
                      {licenseType.name}
                    </option>
                  ))}
                </select>

                <Button
                  type="submit"
                  className="mt-4"
                  disabled={
                    isRequesting || !selectedLicenseTypeId
                  }
                >
                  {isRequesting
                    ? "Submitting..."
                    : "Submit License Request"}
                </Button>
              </>
            ) : (
              <p className="mt-3 leading-7 text-[#737373]">
                No additional licenses are currently available.
              </p>
            )}
          </form>
        </>
      )}

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
    </div>
  )
}

export default FactionLicenseManager