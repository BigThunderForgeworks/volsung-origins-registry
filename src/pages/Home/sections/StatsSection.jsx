import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

function StatsSection() {
  const [stats, setStats] = useState([
    {
      id: 1,
      label: "Registered Personnel",
      value: "—",
      detail: "Approved registry profiles",
    },
    {
      id: 2,
      label: "Registered Factions",
      value: "—",
      detail: "Recognized server-level factions",
    },
    {
      id: 3,
      label: "Registered Companies",
      value: "—",
      detail: "Active corporate organizations",
    },
    {
      id: 4,
      label: "Active Licenses",
      value: "—",
      detail: "Faction and Company operating licenses",
    },
  ])

  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setErrorMessage("")

    const [
      { count: personnelCount, error: personnelError },
      { count: factionCount, error: factionError },
      { count: companyCount, error: companyError },
      {
        count: activeFactionLicenseCount,
        error: activeFactionLicenseError,
      },
      {
        count: pendingFactionLicenseCount,
        error: pendingFactionLicenseError,
      },
      {
        count: activeCompanyLicenseCount,
        error: activeCompanyLicenseError,
      },
      {
        count: pendingCompanyLicenseCount,
        error: pendingCompanyLicenseError,
      },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("factions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),

      supabase
        .from("companies")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),

      supabase
        .from("faction_licenses")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),

      supabase
        .from("faction_licenses")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),

      supabase
        .from("company_licenses")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),

      supabase
        .from("company_licenses")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
    ])

    const firstError =
      personnelError ||
      factionError ||
      companyError ||
      activeFactionLicenseError ||
      pendingFactionLicenseError ||
      activeCompanyLicenseError ||
      pendingCompanyLicenseError

    if (firstError) {
      setErrorMessage(firstError.message)
      return
    }

    const activeLicenseCount =
      (activeFactionLicenseCount ?? 0) +
      (activeCompanyLicenseCount ?? 0)

    const pendingLicenseCount =
      (pendingFactionLicenseCount ?? 0) +
      (pendingCompanyLicenseCount ?? 0)

    setStats([
      {
        id: 1,
        label: "Registered Personnel",
        value: personnelCount ?? 0,
        detail: "Approved registry profiles",
      },
      {
        id: 2,
        label: "Registered Factions",
        value: factionCount ?? 0,
        detail: "Recognized server-level factions",
      },
      {
        id: 3,
        label: "Registered Companies",
        value: companyCount ?? 0,
        detail: "Active corporate organizations",
      },
      {
        id: 4,
        label: "Active Licenses",
        value: activeLicenseCount,
        detail: `${activeLicenseCount} Active • ${pendingLicenseCount} Pending`,
      },
    ])
  }

  return (
    <section className="bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Registry Overview
          </p>

          <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider text-[#D9D9D9]">
            Network Statistics
          </h2>
        </div>

        <div className="grid gap-px border border-[#384A59] bg-[#384A59] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.id}
              className="bg-[#1D2328] p-6 transition hover:bg-[#22282D]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
                {stat.label}
              </p>

              <p className="mt-4 text-5xl font-bold text-[#D9D9D9]">
                {stat.value}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#737373]">
                {stat.detail}
              </p>
            </article>
          ))}
        </div>

        {errorMessage && (
          <div className="mt-4 border border-red-700 bg-red-900/20 px-5 py-4 text-sm text-red-400">
            Failed to load registry statistics: {errorMessage}
          </div>
        )}
      </div>
    </section>
  )
}

export default StatsSection