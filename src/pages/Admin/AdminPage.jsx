import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"

function formatDate(dateValue) {
  if (!dateValue) {
    return "Unknown"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue))
}

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

        <div className="grid gap-px border border-[#384A59] bg-[#384A59] sm:grid-cols-2 lg:grid-cols-4">
          <article className="bg-[#1D2328] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
              Registered Personnel
            </p>
            <p className="mt-4 text-5xl font-bold">{stats.personnel}</p>
          </article>

          <article className="bg-[#1D2328] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
              Registered Factions
            </p>
            <p className="mt-4 text-5xl font-bold">{stats.factions}</p>
          </article>

          <article className="bg-[#1D2328] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
              Pending Licenses
            </p>
            <p className="mt-4 text-5xl font-bold">
              {stats.pendingLicenses}
            </p>
          </article>

          <article className="bg-[#1D2328] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
              Pending Memberships
            </p>
            <p className="mt-4 text-5xl font-bold">
              {stats.pendingMemberships}
            </p>
          </article>
        </div>

        <div className="mt-10 space-y-8">
          <Card
            title="Pending License Applications"
            subtitle="Administrator review"
          >
            {pendingLicenses.length > 0 ? (
              <div className="space-y-5">
                {pendingLicenses.map((license) => {
                  const isReviewing =
                    reviewingLicenseId === license.id

                  return (
                    <div
                      key={license.id}
                      className="flex flex-col gap-5 border-b border-[#384A59] pb-5 last:border-b-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="gold">
                            {license.license_types?.name ??
                              "Unknown License"}
                          </Badge>

                          <Badge>
                            {license.factions?.short_name ??
                              "Unknown Faction"}
                          </Badge>
                        </div>

                        <h2 className="mt-4 text-xl font-bold uppercase tracking-wider">
                          {license.factions?.name ?? "Unknown Faction"}
                        </h2>

                        <p className="mt-2 text-sm text-[#737373]">
                          Founder:{" "}
                          {license.factions?.founder_name ?? "Unknown"}
                        </p>

                        <p className="mt-1 text-sm text-[#737373]">
                          Classification:{" "}
                          {license.license_types?.classification ??
                            "Unclassified"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          disabled={isReviewing}
                          onClick={() =>
                            handleReviewLicense(license.id, "active")
                          }
                        >
                          {isReviewing ? "Reviewing..." : "Approve"}
                        </Button>

                        <Button
                          variant="outline"
                          disabled={isReviewing}
                          onClick={() =>
                            handleReviewLicense(license.id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="leading-7 text-[#737373]">
                There are no pending license applications.
              </p>
            )}
          </Card>

          <Card
            title="Pending Membership Requests"
            subtitle="Administrator override"
          >
            {pendingMemberships.length > 0 ? (
              <div className="space-y-5">
                {pendingMemberships.map((membership) => {
                  const isReviewing =
                    reviewingMembershipId === membership.id

                  const applicantName =
                    membership.profiles?.character_name ??
                    membership.profiles?.discord_username ??
                    "Unknown Applicant"

                  return (
                    <div
                      key={membership.id}
                      className="flex flex-col gap-5 border-b border-[#384A59] pb-5 last:border-b-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {membership.profiles?.avatar_url ? (
                          <img
                            src={membership.profiles.avatar_url}
                            alt=""
                            className="h-14 w-14 border border-[#384A59] object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center border border-[#384A59] bg-[#111519] text-xl font-bold text-[#99692E]">
                            {applicantName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-bold">{applicantName}</p>

                          <p className="mt-1 text-sm text-[#737373]">
                            Requested membership in{" "}
                            {membership.factions?.name ??
                              "Unknown Faction"}
                          </p>

                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#737373]">
                            {membership.factions?.short_name ?? "No Tag"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          disabled={isReviewing}
                          onClick={() =>
                            handleReviewMembership(
                              membership.id,
                              "approved"
                            )
                          }
                        >
                          {isReviewing ? "Reviewing..." : "Approve"}
                        </Button>

                        <Button
                          variant="outline"
                          disabled={isReviewing}
                          onClick={() =>
                            handleReviewMembership(
                              membership.id,
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
            ) : (
              <p className="leading-7 text-[#737373]">
                There are no pending membership requests.
              </p>
            )}
          </Card>

          <Card
            title="Registered Factions"
            subtitle="Current registry organizations"
          >
            {factions.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {factions.map((faction) => (
                  <div
                    key={faction.id}
                    className="border border-[#384A59] bg-[#111519] p-5"
                  >
                    <div className="flex items-start gap-4">
                      {faction.logo_url ? (
                        <img
                          src={faction.logo_url}
                          alt={`${faction.name} logo`}
                          className="h-16 w-16 border border-[#384A59] object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center border border-[#384A59] text-xs uppercase text-[#737373]">
                          No Logo
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="gold">
                            {faction.short_name}
                          </Badge>

                          <Badge
                            variant={
                              faction.status === "active"
                                ? "success"
                                : "danger"
                            }
                          >
                            {faction.status}
                          </Badge>
                        </div>

                        <h3 className="mt-3 text-lg font-bold uppercase tracking-wider">
                          {faction.name}
                        </h3>

                        <p className="mt-2 text-sm text-[#737373]">
                          Founder: {faction.founder_name}
                        </p>

                        <p className="mt-1 text-sm text-[#737373]">
                          Recruitment:{" "}
                          {faction.recruiting ? "Open" : "Closed"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="mt-5 w-full"
                      onClick={() =>
                        navigate(`/factions/${faction.short_name}`)
                      }
                    >
                      View Registry
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="leading-7 text-[#737373]">
                No factions are registered.
              </p>
            )}
          </Card>

          <Card
            title="Registered Personnel"
            subtitle="Select a user to review their registry details"
          >
            {personnel.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {personnel.map((person) => {
                  const displayName =
                    person.character_name ??
                    person.discord_username ??
                    "Unnamed User"

                  const isSelected = selectedPerson?.id === person.id

                  return (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => handleSelectPerson(person)}
                      className={`flex w-full items-center justify-between gap-4 border p-4 text-left transition ${
                        isSelected
                          ? "border-[#99692E] bg-[#99692E]/10"
                          : "border-[#384A59] bg-[#111519] hover:border-[#99692E]"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {person.avatar_url ? (
                          <img
                            src={person.avatar_url}
                            alt=""
                            className="h-12 w-12 shrink-0 border border-[#384A59] object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#384A59] font-bold text-[#99692E]">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-bold">
                            {displayName}
                          </p>

                          <p className="mt-1 truncate text-sm text-[#737373]">
                            {person.discord_username ||
                              "Email Authentication"}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <Badge
                          variant={
                            person.role === "admin"
                              ? "success"
                              : "default"
                          }
                        >
                          {person.role}
                        </Badge>

                        <span className="text-[#99692E]">
                          {isSelected ? "−" : "+"}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="leading-7 text-[#737373]">
                No personnel are registered.
              </p>
            )}

            {selectedPerson && (
              <div className="mt-8 border border-[#99692E] bg-[#111519] p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    {selectedPerson.avatar_url ? (
                      <img
                        src={selectedPerson.avatar_url}
                        alt=""
                        className="h-20 w-20 border border-[#384A59] object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center border border-[#384A59] text-2xl font-bold text-[#99692E]">
                        {(
                          selectedPerson.character_name ??
                          selectedPerson.discord_username ??
                          "?"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
                        Personnel Record
                      </p>

                      <h3 className="mt-2 text-2xl font-bold uppercase tracking-wider">
                        {selectedPerson.character_name ??
                          selectedPerson.discord_username ??
                          "Unnamed User"}
                      </h3>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedPerson(null)}
                  >
                    Close Details
                  </Button>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="border border-[#384A59] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                      Site Role
                    </p>
                    <div className="mt-3">
                      <Badge
                        variant={
                          selectedPerson.role === "admin"
                            ? "success"
                            : "default"
                        }
                      >
                        {selectedPerson.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="border border-[#384A59] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                      Discord / Authentication
                    </p>
                    <p className="mt-3 font-bold">
                      {selectedPerson.discord_username ||
                        "Email Authentication"}
                    </p>
                  </div>

                  <div className="border border-[#384A59] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                      Registered
                    </p>
                    <p className="mt-3 font-bold">
                      {formatDate(selectedPerson.created_at)}
                    </p>
                  </div>

                  <div className="border border-[#384A59] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                      Faction
                    </p>
                    <p className="mt-3 font-bold">
                      {selectedPerson.membership?.factions?.name ??
                        "Unaffiliated"}
                    </p>

                    {selectedPerson.membership?.factions?.short_name && (
                      <p className="mt-1 text-sm uppercase tracking-wider text-[#99692E]">
                        {selectedPerson.membership.factions.short_name}
                      </p>
                    )}
                  </div>

                  <div className="border border-[#384A59] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                      Faction Role
                    </p>
                    <p className="mt-3 font-bold capitalize">
                      {selectedPerson.membership?.member_role ??
                        "None"}
                    </p>
                  </div>

                  <div className="border border-[#384A59] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                      Membership Status
                    </p>
                    <div className="mt-3">
                      {selectedPerson.membership ? (
                        <Badge
                          variant={
                            selectedPerson.membership.status ===
                            "approved"
                              ? "success"
                              : selectedPerson.membership.status ===
                                  "rejected"
                                ? "danger"
                                : "gold"
                          }
                        >
                          {selectedPerson.membership.status}
                        </Badge>
                      ) : (
                        <Badge>None</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {selectedPerson.membership?.factions?.short_name && (
                  <Button
                    variant="secondary"
                    className="mt-6"
                    onClick={() =>
                      navigate(
                        `/factions/${selectedPerson.membership.factions.short_name}`
                      )
                    }
                  >
                    View Their Faction
                  </Button>
                )}
              </div>
            )}
          </Card>
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