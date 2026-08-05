import { useState } from "react"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"

function formatPublishDate(dateValue) {
  if (!dateValue) {
    return "Unscheduled"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue))
}

function getCategoryDetails(category) {
  const categories = {
    industry: {
      label: "Industry Bulletin",
      variant: "gold",
    },
    security: {
      label: "Security Advisory",
      variant: "danger",
    },
    exploration: {
      label: "Exploration Report",
      variant: "default",
    },
    commerce: {
      label: "Commerce Update",
      variant: "success",
    },
    logistics: {
      label: "Logistics Report",
      variant: "default",
    },
    registry: {
      label: "Registry Notice",
      variant: "gold",
    },
    general: {
      label: "General Report",
      variant: "default",
    },
  }

  return (
    categories[category] ?? {
      label: "Colonial Report",
      variant: "default",
    }
  )
}

function NewsArticleCard({ article, featured = false }) {
  const [isExpanded, setIsExpanded] = useState(featured)

  const categoryDetails = getCategoryDetails(article.category)

  return (
    <article
      className={`border bg-[#111519] ${
        featured
          ? "border-[#99692E]"
          : "border-[#384A59]"
      }`}
    >
      <div className={featured ? "p-7 sm:p-8" : "p-6"}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={categoryDetails.variant}>
            {categoryDetails.label}
          </Badge>

          {featured && (
            <Badge variant="success">
              Featured Report
            </Badge>
          )}

          {article.factions?.short_name && (
            <Badge>
              {article.factions.short_name}
            </Badge>
          )}
        </div>

        <p className="mt-5 text-xs uppercase tracking-[0.25em] text-[#737373]">
          {article.source_name || "Colonial News Network"}
          {" // "}
          {formatPublishDate(article.published_at)}
        </p>

        <h2
          className={`mt-4 font-bold uppercase tracking-wider text-[#D9D9D9] ${
            featured
              ? "text-3xl sm:text-4xl"
              : "text-2xl"
          }`}
        >
          {article.headline}
        </h2>

        <p className="mt-5 text-lg leading-8 text-[#A6A6A6]">
          {article.summary}
        </p>

        {isExpanded && (
          <div className="mt-6 border-t border-[#384A59] pt-6">
            <div className="space-y-5 leading-8 text-[#D9D9D9]">
              {article.body
                .split(/\n+/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={`${article.id}-${index}`}>
                    {paragraph}
                  </p>
                ))}
            </div>

            {article.factions?.name && (
              <p className="mt-6 text-sm uppercase tracking-wider text-[#737373]">
                Related organization:{" "}
                <span className="text-[#99692E]">
                  {article.factions.name}
                </span>
              </p>
            )}
          </div>
        )}

        {!featured && (
          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() =>
              setIsExpanded((currentValue) => !currentValue)
            }
          >
            {isExpanded ? "Close Report" : "Read Full Report"}
          </Button>
        )}
      </div>
    </article>
  )
}

export default NewsArticleCard