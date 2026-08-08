import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

function useCompanyMembership(companyId) {
  const [user, setUser] = useState(null)
  const [membership, setMembership] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadMembership()
  }, [companyId])

  async function loadMembership() {
    setIsLoading(true)
    setErrorMessage("")

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      setErrorMessage(userError.message)
      setIsLoading(false)
      return
    }

    setUser(currentUser ?? null)

    if (!currentUser || !companyId) {
      setMembership(null)
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("company_memberships")
      .select(`
        id,
        company_id,
        member_role,
        status
      `)
      .eq("profile_id", currentUser.id)
      .in("status", ["pending", "approved"])
      .maybeSingle()

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setMembership(data ?? null)
    setIsLoading(false)
  }

  async function requestMembership() {
    if (!user || !companyId) {
      setErrorMessage("You must be signed in to request company membership.")
      return false
    }

    setIsSubmitting(true)
    setErrorMessage("")

    const { error } = await supabase.rpc(
      "request_company_membership",
      {
        p_company_id: companyId,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return false
    }

    await loadMembership()

    setIsSubmitting(false)
    return true
  }

  return {
    user,
    membership,
    isLoading,
    isSubmitting,
    errorMessage,
    requestMembership,
    reload: loadMembership,
  }
}

export default useCompanyMembership