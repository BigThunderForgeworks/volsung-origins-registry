import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function AdminCompanyLicensesCard() {
  const [licenses, setLicenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadLicenses()
  }, [])

  async function loadLicenses() {
    setIsLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase
      .from("company_licenses")
      .select(`
        id,
        company_id,
        license_type_id,
        status,
        created_at,
        companies (
          id,
          name,
          short_name
        ),
        license_types (
          id,
          name,
          short_name,
          classification
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setLicenses(data ?? [])
    setIsLoading(false)
  }

  async function reviewLicense(companyLicenseId, decision) {
    setReviewingId(companyLicenseId)
    setErrorMessage("")
    setMessage("")

    const { error } = await supabase.rpc(
      "review_company_license",
      {
        p_company_license_id: companyLicenseId,
        p_decision: decision,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setReviewingId(null)
      return
    }

    setMessage(
      decision === "active"
        ? "Company license approved."
        : "Company license rejected."
    )

    await loadLicenses()
    setReviewingId(null)
  }

  if (isLoading) {
    return (
      <Card
        title="Pending Company Licenses"
        subtitle="Loading company license requests"
      />
    )
  }

  return (
    <Card
      title="Pending Company Licenses"
      subtitle="Corporate operating license approvals"
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

      {licenses.length === 0 ? (
        <p className="leading-7 text-[#737373]">
          No pending Company license requests.
        </p>
      ) : (
        <div className="space-y-4">
          {licenses.map((license) => {
            const company = license.companies
            const licenseType = license.license_types

            return (
              <div
                key={license.id}
                className="flex flex-col gap-4 border border-[#384A59] bg-[#111519] p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="font-bold uppercase tracking-wider">
                    {company?.name ?? "Unknown Company"}
                  </p>

                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[#737373]">
                    [{company?.short_name ?? "N/A"}]
                  </p>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                    Requested License
                  </p>

                  <p className="mt-1 text-sm text-[#D9D9D9]">
                    {licenseType?.name ?? "Unknown License"}{" "}
                    [{licenseType?.short_name ?? "N/A"}]
                  </p>

                  {licenseType?.classification && (
                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#737373]">
                      {licenseType.classification}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={reviewingId === license.id}
                    onClick={() =>
                      reviewLicense(
                        license.id,
                        "active"
                      )
                    }
                  >
                    {reviewingId === license.id
                      ? "Processing..."
                      : "Approve"}
                  </Button>

                  <Button
                    variant="outline"
                    disabled={reviewingId === license.id}
                    onClick={() =>
                      reviewLicense(
                        license.id,
                        "rejected"
                      )
                    }
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default AdminCompanyLicensesCard