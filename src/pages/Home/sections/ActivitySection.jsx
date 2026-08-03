import { useEffect, useState } from "react"
import Badge from "../../../components/ui/Badge"
import { supabase } from "../../../lib/supabase"

function formatRelativeTime(timestamp) {
  const eventTime = new Date(timestamp).getTime()
  const now = Date.now()
  const differenceInSeconds = Math.max(
    Math.floor((now - eventTime) / 1000),
    0
  )

  if (differenceInSeconds < 60) {
    return "Just now"
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60)

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} minute${
      differenceInMinutes === 1 ? "" : "s"
    } ago`
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60)

  if (differenceInHours < 24) {
    return `${differenceInHours} hour${
      differenceInHours === 1 ? "" : "s"
    } ago`
  }

  const differenceInDays = Math.floor(differenceInHours / 24)

  return `${differenceInDays} day${
    differenceInDays === 1 ? "" : "s"
  } ago`
}

function ActivitySection() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadActivities()
  }, [])

  async function loadActivities() {
    setIsLoading(true)
    setErrorMessage("")

    const [
      { data: factionRecords, error: factionError },
      { data: profileRecords, error: profileError },
      { data: licenseRecords, error: licenseError },
    ] = await Promise.all([
      supabase
        .from("factions")
        .select(`
          id,
          name,
          created_at
        `)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("profiles")
        .select(`
          id,
          character_name,
          discord_username,
          created_at
        `)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("faction_licenses")
        .select(`
          id,
          status,
          created_at,
          factions (
            name
          ),
          license_types (
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5),
    ])

    const firstError =
      factionError ||
      profileError ||
      licenseError

    if (firstError) {
      setErrorMessage(firstError.message)
      setIsLoading(false)
      return
    }

    const factionActivities = (factionRecords ?? []).map((faction) => ({
      id: `faction-${faction.id}`,
      type: "Faction",
      message: `${faction.name} completed faction registration.`,
      timestamp: faction.created_at,
    }))

    const profileActivities = (profileRecords ?? []).map((profile) => ({
      id: `profile-${profile.id}`,
      type: "Personnel",
      message: `${
        profile.character_name ||
        profile.discord_username ||
        "A new player"
      } joined the registry.`,
      timestamp: profile.created_at,
    }))

    const licenseActivities = (licenseRecords ?? []).map((license) => ({
      id: `license-${license.id}`,
      type: "License",
      message: `${license.factions?.name ?? "A faction"} submitted a ${
        license.license_types?.name ?? "license"
      } request with status ${license.status}.`,
      timestamp: license.created_at,
    }))

    const combinedActivities = [
      ...factionActivities,
      ...profileActivities,
      ...licenseActivities,
    ]
      .sort(
        (firstActivity, secondActivity) =>
          new Date(secondActivity.timestamp).getTime() -
          new Date(firstActivity.timestamp).getTime()
      )
      .slice(0, 8)

    setActivities(combinedActivities)
    setIsLoading(false)
  }

  return (
    <section className="border-b border-[#384A59] bg-[#1D2328] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Registry Feed
          </p>

          <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider text-[#D9D9D9]">
            Recent Activity
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-[#737373]">
            Recent faction, personnel, and licensing updates recorded by the
            Volsung Industries registry.
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center border border-[#384A59] bg-[#171B1F]">
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Registry Activity
            </p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center border border-dashed border-[#384A59] bg-[#171B1F] px-6 text-center">
            <div>
              <p className="text-xl font-bold uppercase tracking-wider">
                No Registry Activity
              </p>

              <p className="mt-2 text-[#737373]">
                New registrations and license requests will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-[#384A59] bg-[#171B1F]">
            {activities.map((activity, index) => (
              <article
                key={activity.id}
                className={`grid gap-4 p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center ${
                  index !== activities.length - 1
                    ? "border-b border-[#384A59]"
                    : ""
                }`}
              >
                <Badge variant="gold">{activity.type}</Badge>

                <p className="leading-7 text-[#D9D9D9]">
                  {activity.message}
                </p>

                <time className="text-xs uppercase tracking-widest text-[#737373]">
                  {formatRelativeTime(activity.timestamp)}
                </time>
              </article>
            ))}
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 border border-red-700 bg-red-900/20 px-5 py-4 text-sm text-red-400">
            Failed to load registry activity: {errorMessage}
          </div>
        )}
      </div>
    </section>
  )
}

export default ActivitySection