import { useState } from "react"
import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import { supabase } from "../../../lib/supabase"

function CompanyMemberActions({
  membership,
  company,
  onMembershipChanged,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  if (
    !membership ||
    membership.status !== "approved" ||
    membership.member_role === "owner"
  ) {
    return null
  }

  async function handleLeaveCompany() {
    const confirmed = window.confirm(
      `Leave ${company.name}? You will no longer be registered as a member of this Company.`
    )

    if (!confirmed) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    const { error } = await supabase.rpc(
      "leave_company"
    )

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)

    if (onMembershipChanged) {
      await onMembershipChanged()
    }
  }

  return (
    <Card
      title="Company Membership"
      subtitle="Personnel actions"
    >
      <p className="leading-7 text-[#737373]">
        You are currently an approved member of {company.name}.
      </p>

      <Button
        className="mt-6"
        variant="outline"
        disabled={isSubmitting}
        onClick={handleLeaveCompany}
      >
        {isSubmitting
          ? "Leaving..."
          : "Leave Company"}
      </Button>

      {errorMessage && (
        <div className="mt-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}
    </Card>
  )
}

export default CompanyMemberActions