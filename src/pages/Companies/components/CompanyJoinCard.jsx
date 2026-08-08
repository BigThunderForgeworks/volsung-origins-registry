import Button from "../../../components/ui/Button"
import Card from "../../../components/ui/Card"
import useCompanyMembership from "../hooks/useCompanyMembership"
import CompanyMemberActions from "./CompanyMemberActions"

function CompanyJoinCard({ company }) {
  const {
    user,
    membership,
    isLoading,
    isSubmitting,
    errorMessage,
    requestMembership,
    reload,
  } = useCompanyMembership(company.id)

  if (isLoading) {
    return null
  }

  if (!user) {
    return (
      <Card
        title="Company Membership"
        subtitle="Authentication required"
      >
        <p className="leading-7 text-[#737373]">
          Sign in to request membership with this Company.
        </p>
      </Card>
    )
  }

  if (membership?.company_id === company.id) {
    if (
      membership.status === "approved" &&
      membership.member_role !== "owner"
    ) {
      return (
        <CompanyMemberActions
          membership={membership}
          company={company}
          onMembershipChanged={reload}
        />
      )
    }

    return (
      <Card
        title="Company Membership"
        subtitle={
          membership.status === "approved"
            ? "Registered Company Owner"
            : "Membership request pending"
        }
      >
        <p className="leading-7 text-[#737373]">
          {membership.status === "approved"
            ? "You are the registered owner of this Company."
            : "Your membership request is awaiting Company approval."}
        </p>
      </Card>
    )
  }

  if (membership) {
    return (
      <Card
        title="Company Membership"
        subtitle="Existing Company relationship"
      >
        <p className="leading-7 text-[#737373]">
          You already belong to another Company or have a pending Company
          membership request.
        </p>
      </Card>
    )
  }

  if (!company.recruiting) {
    return (
      <Card
        title="Company Membership"
        subtitle="Recruitment closed"
      >
        <p className="leading-7 text-[#737373]">
          This Company is not currently accepting membership requests.
        </p>
      </Card>
    )
  }

  return (
    <Card
      title="Company Membership"
      subtitle="Recruitment open"
    >
      <p className="leading-7 text-[#737373]">
        This Company is currently accepting personnel membership requests.
      </p>

      <Button
        className="mt-6"
        disabled={isSubmitting}
        onClick={requestMembership}
      >
        {isSubmitting
          ? "Submitting..."
          : "Request Membership"}
      </Button>

      {errorMessage && (
        <div className="mt-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
          {errorMessage}
        </div>
      )}
    </Card>
  )
}

export default CompanyJoinCard