function AdminStats({ stats }) {
  return (
    <div className="grid gap-px border border-[#384A59] bg-[#384A59] sm:grid-cols-2 lg:grid-cols-4">
      <article className="bg-[#1D2328] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
          Registered Personnel
        </p>

        <p className="mt-4 text-5xl font-bold">
          {stats.personnel}
        </p>
      </article>

      <article className="bg-[#1D2328] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#737373]">
          Registered Factions
        </p>

        <p className="mt-4 text-5xl font-bold">
          {stats.factions}
        </p>
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
  )
}

export default AdminStats