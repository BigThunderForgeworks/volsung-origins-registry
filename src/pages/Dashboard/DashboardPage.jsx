import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"
import FactionLicenseManager from "./components/FactionLicenseManager"
import OrganizationMigrationNotice from "./components/OrganizationMigrationNotice"
import CompanyStatusCard from "./components/CompanyStatusCard"
import CompanyMembershipRequestsCard from "./components/CompanyMembershipRequestsCard"
import CompanyManagementCard from "./components/CompanyManagementCard"
import CompanyAffiliationRequestsCard from "../../components/CompanyAffiliationRequestsCard"

function DashboardPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [membership, setMembership] = useState(null)
  const [faction, setFaction] = useState(null)
  const [pendingMemberships, setPendingMemberships] = useState([])

  const [characterName, setCharacterName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [reviewingMembershipId, setReviewingMembershipId] =
    useState(null)

  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setIsLoading(true)
    setErrorMessage("")

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !currentUser) {
      navigate("/login")
      return
    }

    setUser(currentUser)

    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle()

    if (profileError) {
      setErrorMessage(profileError.message)
      setIsLoading(false)
      return
    }

    let currentProfile = existingProfile

    if (!currentProfile) {
      const providerMetadata = currentUser.user_metadata ?? {}

      const discordId =
        providerMetadata.provider_id ??
        providerMetadata.sub ??
        null

      const discordUsername =
        providerMetadata.full_name ??
        providerMetadata.name ??
        providerMetadata.user_name ??
        providerMetadata.preferred_username ??
        null

      const avatarUrl =
        providerMetadata.avatar_url ??
        providerMetadata.picture ??
        null

      const { data: createdProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: currentUser.id,
          discord_id: discordId,
          discord_username: discordUsername,
          avatar_url: avatarUrl,
        })
        .select()
        .single()

      if (createError) {
        setErrorMessage(createError.message)
        setIsLoading(false)
        return
      }

      currentProfile = createdProfile
    }

    setProfile(currentProfile)
    setCharacterName(currentProfile.character_name ?? "")

    const { data: membershipRecord, error: membershipError } =
      await supabase
        .from("faction_memberships")
        .select("*")
        .eq("profile_id", currentUser.id)
        .in("status", ["pending", "approved"])
        .maybeSingle()

    if (membershipError) {
      setErrorMessage(membershipError.message)
      setIsLoading(false)
      return
    }

    setMembership(membershipRecord)
    setFaction(null)
    setPendingMemberships([])

    if (
      membershipRecord?.faction_id &&
      ["pending", "approved"].includes(membershipRecord.status)) {
      const { data: factionRecord, error: factionError } = await supabase
        .from("factions")
        .select("*")
        .eq("id", membershipRecord.faction_id)
        .single()

      if (factionError) {
        setErrorMessage(factionError.message)
        setIsLoading(false)
        return
      }

      setFaction(factionRecord)

      if (
        membershipRecord.member_role === "owner" &&
        membershipRecord.status === "approved"
      ) {
        const {
          data: pendingMembershipRecords,
          error: pendingMembershipError,
        } = await supabase
          .from("faction_memberships")
          .select(`
            id,
            profile_id,
            member_role,
            status,
            created_at,
            profiles (
              character_name,
              discord_username,
              avatar_url
            )
          `)
          .eq("faction_id", membershipRecord.faction_id)
          .eq("status", "pending")
          .order("created_at", { ascending: true })

        if (pendingMembershipError) {
          setErrorMessage(pendingMembershipError.message)
          setIsLoading(false)
          return
        }

        setPendingMemberships(pendingMembershipRecords ?? [])
      }
    }

    setIsLoading(false)
  }

  async function handleSaveCharacterName(event) {
    event.preventDefault()

    setMessage("")
    setErrorMessage("")

    const trimmedName = characterName.trim()

    if (!trimmedName) {
      setErrorMessage("Enter your Space Engineers character name.")
      return
    }

    setIsSaving(true)

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({
        character_name: trimmedName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      setErrorMessage(error.message)
    } else {
      setProfile(updatedProfile)
      setCharacterName(updatedProfile.character_name)
      setMessage("Registry profile updated.")
    }

    setIsSaving(false)
  }

  async function handleReviewMembership(membershipId, decision) {
    setMessage("")
    setErrorMessage("")
    setReviewingMembershipId(membershipId)

    const { error } = await supabase.rpc(
      "review_faction_membership",
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

    setPendingMemberships((currentRequests) =>
      currentRequests.filter(
        (request) => request.id !== membershipId
      )
    )

    setMessage(
      decision === "approved"
        ? "Membership request approved."
        : "Membership request rejected."
    )

    setReviewingMembershipId(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate("/")
  }

  if (isLoading) {
    return (
      <section className="bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-4xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Registry Profile
            </p>
          </Card>
        </div>
      </section>
    )
  }

  const needsCharacterName = !profile?.character_name
  const isFactionOwner =
    membership?.member_role === "owner" &&
    membership?.status === "approved"

  return (
    <section className="bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 border-b border-[#384A59] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
              Player Portal
            </p>

            <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
              Dashboard
            </h1>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        {needsCharacterName ? (
          <Card
            title="Complete Your Registry Profile"
            subtitle="First-time personnel setup"
          >
            <p className="max-w-3xl leading-7 text-[#737373]">
              Your login account is connected. Enter the name you use in the
              Space Engineers server. This can be different from your Discord
              username and can be changed later.
            </p>

            <form
              className="mt-8 max-w-xl"
              onSubmit={handleSaveCharacterName}
            >
              <label
                htmlFor="character-name"
                className="text-xs font-bold uppercase tracking-[0.25em] text-[#D9D9D9]"
              >
                Character Name
              </label>

              <input
                id="character-name"
                type="text"
                value={characterName}
                onChange={(event) =>
                  setCharacterName(event.target.value)
                }
                placeholder="Enter your in-game name"
                className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none transition placeholder:text-[#737373] focus:border-[#99692E]"
              />

              <Button
                type="submit"
                className="mt-5"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Character Name"}
              </Button>
            </form>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <Card
              title={profile.character_name}
              subtitle="Registered Personnel"
            >
              <div className="flex items-center gap-5">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-20 w-20 border border-[#384A59] object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center border border-[#384A59] bg-[#111519] text-2xl font-bold text-[#99692E]">
                    {profile.character_name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#737373]">
                    Discord Account
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    {profile.discord_username || "Email Authentication"}
                  </p>
                </div>
              </div>

              <form className="mt-8" onSubmit={handleSaveCharacterName}>
                <label
                  htmlFor="edit-character-name"
                  className="text-xs font-bold uppercase tracking-[0.25em] text-[#D9D9D9]"
                >
                  Character Name
                </label>

                <input
                  id="edit-character-name"
                  type="text"
                  value={characterName}
                  onChange={(event) =>
                    setCharacterName(event.target.value)
                  }
                  className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none transition focus:border-[#99692E]"
                />

                <Button
                  type="submit"
                  variant="secondary"
                  className="mt-5 w-full"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Update Registry Name"}
                </Button>
              </form>
            </Card>

            <div className="space-y-8">
              <OrganizationMigrationNotice
                factionId={faction?.id ?? null}
                isFactionOwner={isFactionOwner}
              />
              
              {faction ? (
                <Card
                  title={faction.name}
                  subtitle={`Faction ${faction.short_name}`}
                >
                  <div className="grid gap-6 sm:grid-cols-[140px_1fr]">
                    <div>
                      {faction.logo_url ? (
                        <img
                          src={faction.logo_url}
                          alt={`${faction.name} logo`}
                          className="aspect-square w-full border border-[#384A59] object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center border border-[#384A59] bg-[#111519] text-center text-sm uppercase tracking-wider text-[#737373]">
                          No Logo
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-3">
                        <Badge variant="gold">
                          {membership?.member_role ?? "Member"}
                        </Badge>

                        <Badge
                          variant={
                            faction.recruiting ? "success" : "danger"
                          }
                        >
                          {faction.recruiting
                            ? "Recruiting"
                            : "Recruitment Closed"}
                        </Badge>
                      </div>

                      {faction.motto && (
                        <p className="mt-5 text-lg italic text-[#D9D9D9]">
                          “{faction.motto}”
                        </p>
                      )}

                      <p className="mt-5 leading-7 text-[#737373]">
                        {faction.description}
                      </p>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="border border-[#384A59] bg-[#111519] p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                            Founder
                          </p>

                          <p className="mt-2 font-bold">
                            {faction.founder_name}
                          </p>
                        </div>

                        <div className="border border-[#384A59] bg-[#111519] p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                            Founded
                          </p>

                          <p className="mt-2 font-bold">
                            {faction.founded_date}
                          </p>
                        </div>
                      </div>

                      <FactionLicenseManager
                        factionId={faction.id}
                        isFactionOwner={isFactionOwner}
                      />

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(`/factions/${faction.short_name}`)
                          }
                        >
                          View Faction Registry
                        </Button>

                        {isFactionOwner && (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              navigate(`/factions/${faction.short_name}/edit`)
                            }
                          >
                            Edit Faction
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card
                  title="Faction Status"
                  subtitle="Industrial affiliation"
                >
                  
                  <p className="leading-7 text-[#737373]">
                    You are not currently affiliated with a registered
                    faction.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button
                      onClick={() => navigate("/factions/create")}
                    >
                      Create a Faction
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => navigate("/")}
                    >
                      Join an Existing Faction
                    </Button>
                  </div>
                </Card>
              )}

              <CompanyStatusCard />

              <CompanyMembershipRequestsCard />

              <CompanyManagementCard />

              {faction && isFactionOwner && (
                <CompanyAffiliationRequestsCard
                  factionId={faction.id}
                />
              )}

              {faction && isFactionOwner && (
                <Card
                  title="Pending Membership Requests"
                  subtitle="Faction owner review"
                >
                  {pendingMemberships.length > 0 ? (
                    <div className="space-y-4">
                      {pendingMemberships.map((request) => {
                        const applicantName =
                          request.profiles?.character_name ??
                          request.profiles?.discord_username ??
                          "Unknown Applicant"

                        const isReviewing =
                          reviewingMembershipId === request.id

                        return (
                          <div
                            key={request.id}
                            className="flex flex-col gap-5 border-b border-[#384A59] pb-5 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex items-center gap-4">
                              {request.profiles?.avatar_url ? (
                                <img
                                  src={request.profiles.avatar_url}
                                  alt=""
                                  className="h-14 w-14 border border-[#384A59] object-cover"
                                />
                              ) : (
                                <div className="flex h-14 w-14 items-center justify-center border border-[#384A59] bg-[#111519] text-xl font-bold text-[#99692E]">
                                  {applicantName
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}

                              <div>
                                <p className="font-bold">
                                  {applicantName}
                                </p>

                                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#737373]">
                                  Membership requested
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <Button
                                disabled={isReviewing}
                                onClick={() =>
                                  handleReviewMembership(
                                    request.id,
                                    "approved"
                                  )
                                }
                              >
                                {isReviewing
                                  ? "Reviewing..."
                                  : "Approve"}
                              </Button>

                              <Button
                                variant="outline"
                                disabled={isReviewing}
                                onClick={() =>
                                  handleReviewMembership(
                                    request.id,
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
              )}
            </div>
          </div>
        )}

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

export default DashboardPage