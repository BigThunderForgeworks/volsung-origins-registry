import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"
import PersonnelDirectory from "./components/PersonnelDirectory"
import RegisteredFactionsCard from "./components/RegisteredFactionsCard"
import PendingMembershipsCard from "./components/PendingMembershipsCard"
import PendingLicensesCard from "./components/PendingLicensesCard"
import AdminStats from "./components/AdminStats"

function AdminPage() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [pendingLicenses, setPendingLicenses] = useState([])
  const [pendingMemberships, setPendingMemberships] = useState([])
  const [factions, setFactions] = useState([])
  const [personnel, setPersonnel] = useState([])
  const [selectedPerson, setSelectedPerson] = useState(null)

  const [stats, setStats] = useState({
    personnel: 0,
    factions: 0,
    pendingLicenses: 0,
    pendingMemberships: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [reviewingLicenseId, setReviewingLicenseId] = useState(null)
  const [reviewingMembershipId, setReviewingMembershipId] =
    useState(null)
  const [removingMembershipId, setRemovingMembershipId] = 
    useState(null)

  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadAdminPortal()
  }, [])

  async function loadAdminPortal() {
    setIsLoading(true)
    setMessage("")
    setErrorMessage("")

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      navigate("/login")
      return
    }

    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      setErrorMessage(profileError.message)
      setIsLoading(false)
      return
    }

    if (!currentProfile || currentProfile.role !== "admin") {
      navigate("/")
      return
    }

    setProfile(currentProfile)

    const [
      { count: personnelCount, error: personnelCountError },
      { count: factionCount, error: factionCountError },
      { count: pendingLicenseCount, error: pendingLicenseCountError },
      {
        count: pendingMembershipCount,
        error: pendingMembershipCountError,
      },
      { data: pendingLicenseRecords, error: pendingLicenseError },
      {
        data: pendingMembershipRecords,
        error: pendingMembershipError,
      },
      { data: factionRecords, error: factionError },
      { data: personnelRecords, error: personnelError },
      { data: personnelMembershipRecords, error: personnelMembershipError },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("factions")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("faction_licenses")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),

      supabase
        .from("faction_memberships")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),

      supabase
        .from("faction_licenses")
        .select(`
          id,
          status,
          created_at,
          factions (
            id,
            name,
            short_name,
            founder_name
          ),
          license_types (
            id,
            name,
            short_name,
            classification
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: true }),

      supabase
        .from("faction_memberships")
        .select(`
          id,
          faction_id,
          profile_id,
          member_role,
          status,
          created_at,
          factions (
            id,
            name,
            short_name
          ),
          profiles (
            id,
            character_name,
            discord_username,
            avatar_url
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: true }),

      supabase
        .from("factions")
        .select(`
          id,
          name,
          short_name,
          founder_name,
          logo_url,
          recruiting,
          status,
          created_at
        `)
        .order("created_at", { ascending: false }),

      supabase
        .from("profiles")
        .select(`
          id,
          character_name,
          discord_id,
          discord_username,
          avatar_url,
          role,
          created_at,
          updated_at
        `)
        .order("created_at", { ascending: false }),

      supabase
        .from("faction_memberships")
        .select(`
          id,
          profile_id,
          faction_id,
          member_role,
          status,
          created_at,
          factions (
            id,
            name,
            short_name
          )
        `),
    ])

    const firstError =
      personnelCountError ||
      factionCountError ||
      pendingLicenseCountError ||
      pendingMembershipCountError ||
      pendingLicenseError ||
      pendingMembershipError ||
      factionError ||
      personnelError ||
      personnelMembershipError

    if (firstError) {
      setErrorMessage(firstError.message)
      setIsLoading(false)
      return
    }

    const personnelWithMemberships = (personnelRecords ?? []).map(
      (person) => ({
        ...person,
        membership:
          (personnelMembershipRecords ?? []).find(
            (membership) => membership.profile_id === person.id
          ) ?? null,
      })
    )

    setStats({
      personnel: personnelCount ?? 0,
      factions: factionCount ?? 0,
      pendingLicenses: pendingLicenseCount ?? 0,
      pendingMemberships: pendingMembershipCount ?? 0,
    })

    setPendingLicenses(pendingLicenseRecords ?? [])
    setPendingMemberships(pendingMembershipRecords ?? [])
    setFactions(factionRecords ?? [])
    setPersonnel(personnelWithMemberships)
    setIsLoading(false)
  }

  async function handleReviewLicense(factionLicenseId, decision) {
    setMessage("")
    setErrorMessage("")
    setReviewingLicenseId(factionLicenseId)

    const { error } = await supabase.rpc("review_faction_license", {
      p_faction_license_id: factionLicenseId,
      p_decision: decision,
    })

    if (error) {
      setErrorMessage(error.message)
      setReviewingLicenseId(null)
      return
    }

    setPendingLicenses((currentLicenses) =>
      currentLicenses.filter(
        (license) => license.id !== factionLicenseId
      )
    )

    setStats((currentStats) => ({
      ...currentStats,
      pendingLicenses: Math.max(
        currentStats.pendingLicenses - 1,
        0
      ),
    }))

    setMessage(
      decision === "active"
        ? "License application approved."
        : "License application rejected."
    )

    setReviewingLicenseId(null)
  }

  async function handleReviewMembership(membershipId, decision) {
    setMessage("")
    setErrorMessage("")
    setReviewingMembershipId(membershipId)

    const { error } = await supabase.rpc(
      "admin_review_faction_membership",
      {
        p_membership_id: membershipId,
        p_decision: decision,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setReviewingMembershipId(null)
      return
    }

    setPendingMemberships((currentMemberships) =>
      currentMemberships.filter(
        (membership) => membership.id !== membershipId
      )
    )

    setStats((currentStats) => ({
      ...currentStats,
      pendingMemberships: Math.max(
        currentStats.pendingMemberships - 1,
        0
      ),
    }))

    setMessage(
      decision === "approved"
        ? "Membership request approved."
        : "Membership request rejected."
    )

    setReviewingMembershipId(null)
  }

async function handleRemoveFactionMember(person) {
  const membership = person.membership

  if (!membership) {
    setErrorMessage("This person does not have a faction membership.")
    return
  }

  if (membership.member_role === "owner") {
    setErrorMessage(
      "Faction owners cannot be removed until ownership is transferred."
    )
    return
  }

  if (membership.status !== "approved") {
    setErrorMessage("Only approved faction members can be removed.")
    return
  }

  const displayName =
    person.character_name ??
    person.discord_username ??
    "this person"

  const factionName =
    membership.factions?.name ?? "their faction"

  const confirmed = window.confirm(
    `Remove ${displayName} from ${factionName}?`
  )

  if (!confirmed) {
    return
  }

  setMessage("")
  setErrorMessage("")
  setRemovingMembershipId(membership.id)

  const { error } = await supabase.rpc(
    "admin_remove_faction_member",
    {
      p_membership_id: membership.id,
    }
  )

  if (error) {
    setErrorMessage(error.message)
    setRemovingMembershipId(null)
    return
  }

  const updatedMembership = {
    ...membership,
    status: "removed",
  }

  setPersonnel((currentPersonnel) =>
    currentPersonnel.map((currentPerson) =>
      currentPerson.id === person.id
        ? {
            ...currentPerson,
            membership: updatedMembership,
          }
        : currentPerson
    )
  )

  setSelectedPerson((currentPerson) =>
    currentPerson?.id === person.id
      ? {
          ...currentPerson,
          membership: updatedMembership,
        }
      : currentPerson
  )

  setMessage(`${displayName} was removed from ${factionName}.`)
  setRemovingMembershipId(null)
}


  function handleSelectPerson(person) {
    setSelectedPerson((currentPerson) =>
      currentPerson?.id === person.id ? null : person
    )
  }

  if (isLoading) {
    return (
      <section className="bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Administration Portal
            </p>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 border-b border-[#384A59] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
              Staff Portal
            </p>

            <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
              Administration
            </h1>

            <p className="mt-4 text-[#737373]">
              Signed in as {profile?.character_name ?? "Administrator"}.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </Button>
        </div>

        
        <AdminStats stats={stats} />
        
        <div className="mt-10 space-y-8">
          
          <PendingLicensesCard
            pendingLicenses={pendingLicenses}
            reviewingLicenseId={reviewingLicenseId}
            onReviewLicense={handleReviewLicense}
          />
          <PendingMembershipsCard
            pendingMemberships={pendingMemberships}
            reviewingMembershipId={reviewingMembershipId}
            onReviewMembership={handleReviewMembership}
          />
          <RegisteredFactionsCard
            factions={factions}
            onNavigate={navigate}
          />
          <PersonnelDirectory
            personnel={personnel}
            selectedPerson={selectedPerson}
            removingMembershipId={removingMembershipId}
            onSelectPerson={handleSelectPerson}
            onCloseDetails={() => setSelectedPerson(null)}
            onNavigate={navigate}
            onRemoveFactionMember={handleRemoveFactionMember}
          />
        </div>

        {message && (
          <div className="mt-8 border border-green-700 bg-green-900/20 px-5 py-4 text-green-400">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mt-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
            {errorMessage}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminPage