import Badge from "../../../components/ui/Badge"

const activities = [
  {
    id: 1,
    type: "License",
    message: "Black Forge registered a Mining License.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "Recruitment",
    message: "Atlas Dynamics closed public recruitment.",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    type: "Faction",
    message: "Helios Industrial completed faction registration.",
    timestamp: "1 day ago",
  },
]

function ActivitySection() {
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
            Recent faction, recruitment, and licensing updates recorded by the
            Volsung Industries registry.
          </p>
        </div>

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
                {activity.timestamp}
              </time>
            </article>
          ))}
        </div>

        <p className="mt-4 text-xs uppercase tracking-widest text-[#737373]">
          Development activity shown until the live registry is connected.
        </p>
      </div>
    </section>
  )
}

export default ActivitySection