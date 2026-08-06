import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"
import FactionLicensesCard from "./components/FactionLicensesCard"

function FactionRegistryPage() {
  const { factionTag } = useParams()
  const navigate = useNavigate()

  const [faction, setFaction] = useState(null)
  const [members, setMembers] = useState([])
  const [licenses, setLicenses] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [currentMembership, setCurrentMembership] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isRequestingMembership, setIsRequestingMembership] =
    useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadFactionRegistry()
  }, [factionTag])

  async function loadFactionRegistry() {
    setIsLoading(true)
    setErrorMessage("")

    const normalizedTag = factionTag?.trim().toUpperCase()

    if (!normalizedTag) {
      setErrorMessage("No faction tag was provided.")
      setIsLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    setCurrentUser(user ?? null)

    const { data: factionRecord, error: factionError } = await supabase
      .from("factions")
      .select("*")
      .eq("short_name", normalizedTag)
      .maybeSingle()

    if (factionError) {
      setErrorMessage(factionError.message)
      setIsLoading(false)
      return
    }

    if (!factionRecord) {
      setErrorMessage("The requested faction could not be found.")
      setIsLoading(false)
      return
    }

    setFaction(factionRecord)

    const [
      { data: membershipRecords, error: membersError },
      { data: licenseRecords, error: licensesError },
    ] = await Promise.all([
      supabase
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
        .eq("faction_id", factionRecord.id)
        .eq("status", "approved")
        .order("created_at"),

      supabase
        .from("faction_licenses")
        .select(`
          id,
          status,
          license_types (
            id,
            name,
            short_name,
            slug
          )
        `)
        .eq("faction_id", factionRecord.id)
        .eq("status", "active")
        .order("created_at"),
    ])

    if (membersError) {
      setErrorMessage(membersError.message)
      setIsLoading(false)
      return
    }

    if (licensesError) {
      setErrorMessage(licensesError.message)
      setIsLoading(false)
      return
    }

    setMembers(membershipRecords ?? [])
    setLicenses(licenseRecords ?? [])

    if (user) {
      const { data: membershipRecord, error: currentMembershipError } =
        await supabase
          .from("faction_memberships")
          .select("*")
          .eq("profile_id", user.id)
          .maybeSingle()

      if (currentMembershipError) {
        setErrorMessage(currentMembershipError.message)
        setIsLoading(false)
        return
      }

      setCurrentMembership(membershipRecord)
    } else {
      setCurrentMembership(null)
    }

    setIsLoading(false)
  }

  async function handleRequestMembership() {
    if (!currentUser) {
      navigate("/login")
      return
    }

    if (!faction) {
      return
    }

    setSuccessMessage("")
    setErrorMessage("")
    setIsRequestingMembership(true)

    const { error } = await supabase.rpc(
      "request_faction_membership",
      {
        p_faction_id: faction.id,
      }
    )

    if (error) {
      setErrorMessage(error.message)
      setIsRequestingMembership(false)
      return
    }

    const { data: membershipRecord, error: membershipError } =
      await supabase
        .from("faction_memberships")
        .select("*")
        .eq("profile_id", currentUser.id)
        .maybeSingle()

    if (membershipError) {
      setErrorMessage(membershipError.message)
      setIsRequestingMembership(false)
      return
    }

    setCurrentMembership(membershipRecord)
    setSuccessMessage(
      `Your membership request was sent to ${faction.name}.`
    )
    setIsRequestingMembership(false)
  }

  if (isLoading) {
    return (
      <section className="bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Faction Registry
            </p>
          </Card>
        </div>
      </section>
    )
  }

  if (!faction) {
    return (
      <section className="bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-4xl">
          <Card title="Faction Not Found" subtitle="Registry error">
            <p className="leading-7 text-[#737373]">
              {errorMessage || "The requested faction does not exist."}
            </p>

            <Link to="/factions" className="mt-8 inline-block">
              <Button>Return to Factions</Button>
            </Link>
          </Card>
        </div>
      </section>
    )
  }

  const isMemberOfThisFaction =
    currentMembership?.faction_id === faction.id &&
    currentMembership?.status === "approved"

  const hasPendingRequestForThisFaction =
    currentMembership?.faction_id === faction.id &&
    currentMembership?.status === "pending"

  const belongsToAnotherFaction =
    currentMembership &&
    currentMembership.faction_id !== faction.id &&
    ["pending", "approved"].includes(currentMembership.status)

  return (
    <section className="bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E] transition hover:text-[#D9D9D9]"
        >
          ← Return to Industrial Registry
        </button>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          <Card>
            {faction.logo_url ? (
              <img
                src={faction.logo_url}
                alt={`${faction.name} logo`}
                className="aspect-square w-full border border-[#384A59] object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center border border-[#384A59] bg-[#111519] px-6 text-center text-sm uppercase tracking-wider text-[#737373]">
                No Logo Registered
              </div>
            )}

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E]">
                Faction Tag
              </p>

              <p className="mt-2 text-3xl font-bold uppercase tracking-wider">
                {faction.short_name}
              </p>
            </div>

            <div className="mt-6 border-t border-[#384A59] pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                Recruitment
              </p>

              <div className="mt-3">
                <Badge variant={faction.recruiting ? "success" : "danger"}>
                  {faction.recruiting ? "Open" : "Closed"}
                </Badge>
              </div>
            </div>

            <div className="mt-6 border-t border-[#384A59] pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                Registered Members
              </p>

              <p className="mt-2 text-3xl font-bold">{members.length}</p>
            </div>
          </Card>

          <div className="space-y-8">
            <Card title={faction.name} subtitle="Faction registry record">
              <div className="flex flex-wrap gap-3">
                <Badge variant="gold">{faction.short_name}</Badge>

                <Badge variant={faction.recruiting ? "success" : "danger"}>
                  {faction.recruiting
                    ? "Recruiting"
                    : "Recruitment Closed"}
                </Badge>
              </div>

              {faction.motto && (
                <p className="mt-6 text-xl italic text-[#D9D9D9]">
                  “{faction.motto}”
                </p>
              )}

              <p className="mt-6 leading-8 text-[#737373]">
                {faction.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="border border-[#384A59] bg-[#111519] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                    Founder
                  </p>

                  <p className="mt-2 font-bold">{faction.founder_name}</p>
                </div>

                <div className="border border-[#384A59] bg-[#111519] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                    Founded
                  </p>

                  <p className="mt-2 font-bold">{faction.founded_date}</p>
                </div>

                <div className="border border-[#384A59] bg-[#111519] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                    Primary Color
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <span
                      className="h-7 w-7 border border-[#384A59]"
                      style={{ backgroundColor: faction.primary_color }}
                    />

                    <span className="font-mono text-sm">
                      {faction.primary_color}
                    </span>
                  </div>
                </div>

                <div className="border border-[#384A59] bg-[#111519] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#737373]">
                    Secondary Color
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <span
                      className="h-7 w-7 border border-[#384A59]"
                      style={{ backgroundColor: faction.secondary_color }}
                    />

                    <span className="font-mono text-sm">
                      {faction.secondary_color}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <FactionLicensesCard licenses={licenses} />

            <Card
              title="Registered Members"
              subtitle="Approved faction personnel"
            >
              {members.length > 0 ? (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-4 border-b border-[#384A59] pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        {member.profiles?.avatar_url ? (
                          <img
                            src={member.profiles.avatar_url}
                            alt=""
                            className="h-12 w-12 border border-[#384A59] object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center border border-[#384A59] bg-[#111519] font-bold text-[#99692E]">
                            {(
                              member.profiles?.character_name ??
                              member.profiles?.discord_username ??
                              "?"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-bold">
                            {member.profiles?.character_name ??
                              member.profiles?.discord_username ??
                              "Unknown Member"}
                          </p>

                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#737373]">
                            {member.member_role}
                          </p>
                        </div>
                      </div>

                      <Badge>{member.member_role}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#737373]">
                  No approved members are currently listed.
                </p>
              )}
            </Card>

            <Card
              title="Membership"
              subtitle="Faction recruitment access"
            >
              {!currentUser ? (
                <>
                  <p className="leading-7 text-[#737373]">
                    Sign in to request membership in this faction.
                  </p>

                  <Button
                    className="mt-6"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </Button>
                </>
              ) : isMemberOfThisFaction ? (
                <Badge variant="success">You Are a Member</Badge>
              ) : hasPendingRequestForThisFaction ? (
                <Badge variant="gold">Membership Request Pending</Badge>
              ) : belongsToAnotherFaction ? (
                <p className="leading-7 text-[#737373]">
                  You already belong to another faction or have a pending
                  membership request.
                </p>
              ) : !faction.recruiting ? (
                <p className="leading-7 text-[#737373]">
                  This faction is not currently accepting membership requests.
                </p>
              ) : (
                <>
                  <p className="leading-7 text-[#737373]">
                    This faction is accepting membership requests.
                  </p>

                  <Button
                    className="mt-6"
                    disabled={isRequestingMembership}
                    onClick={handleRequestMembership}
                  >
                    {isRequestingMembership
                      ? "Submitting Request..."
                      : "Request Membership"}
                  </Button>
                </>
              )}

              {successMessage && (
                <div className="mt-6 border border-green-700 bg-green-900/20 px-5 py-4 text-green-400">
                  {successMessage}
                </div>
              )}
            </Card>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-8 border border-red-700 bg-red-900/20 px-5 py-4 text-sm text-red-400">
            {errorMessage}
          </div>
        )}
      </div>
    </section>
  )
}

export default FactionRegistryPage