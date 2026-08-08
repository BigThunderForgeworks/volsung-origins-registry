import { useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"

function CompanyRecruitingControl({
  company,
  isSaving,
  onChange,
}) {
  const [successMessage, setSuccessMessage] = useState("")

  async function handleRecruitingChange() {
    setSuccessMessage("")

    const newRecruitingStatus = !company.recruiting

    const success = await onChange(
      newRecruitingStatus
    )

    if (success) {
      setSuccessMessage(
        newRecruitingStatus
          ? "Company recruitment opened."
          : "Company recruitment closed."
      )
    }
  }

  return (
    <Card
      title="Recruitment"
      subtitle={
        company.recruiting
          ? "Currently accepting personnel"
          : "Recruitment currently closed"
      }
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold uppercase tracking-wider">
            {company.recruiting
              ? "Recruitment Open"
              : "Recruitment Closed"}
          </p>

          <p className="mt-2 max-w-2xl leading-7 text-[#737373]">
            {company.recruiting
              ? "Players may currently submit membership requests to this Company."
              : "New Company membership requests are currently disabled."}
          </p>
        </div>

        <Button
          variant={
            company.recruiting
              ? "outline"
              : "primary"
          }
          disabled={isSaving}
          onClick={handleRecruitingChange}
        >
          {isSaving
            ? "Updating..."
            : company.recruiting
              ? "Close Recruitment"
              : "Open Recruitment"}
        </Button>
      </div>

      {successMessage && (
        <p className="mt-5 text-sm text-[#99692E]">
          {successMessage}
        </p>
      )}
    </Card>
  )
}

export default CompanyRecruitingControl