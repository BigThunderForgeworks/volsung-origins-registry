import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"
import { supabase } from "../../../lib/supabase"
import { selectNewsForDisplay } from "../../News/newsUtils"

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

function NewsSection() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadNews()
  }, [])

  async function loadNews() {
    setIsLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase
      .from("news_articles")
      .select(`
        id,
        headline,
        summary,
        category,
        is_featured,
        published_at
      `)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setArticles(data ?? [])
    setIsLoading(false)
  }

  const { rotatingArticles } = selectNewsForDisplay(articles, 3)

  return (
    <section className="border-b border-[#384A59] bg-[#171B1F] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 border-b border-[#384A59] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
              Frontier Broadcast Service
            </p>

            <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider text-[#D9D9D9]">
              Latest Colonial News
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#737373]">
              Selected industrial reports, security advisories, and frontier
              developments from the Colonial News Network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-green-400" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-green-400">
              Feed Online
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 border border-[#384A59] bg-[#111519] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#99692E]">
              Receiving Colonial Broadcast
            </p>
          </div>
        ) : errorMessage ? (
          <div className="mt-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
            Colonial news is temporarily unavailable.
          </div>
        ) : rotatingArticles.length > 0 ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {rotatingArticles.map((article) => {
              const categoryDetails = getCategoryDetails(
                article.category
              )

              return (
                <article
                  key={article.id}
                  className="flex h-full flex-col border border-[#384A59] bg-[#111519] p-6 transition hover:-translate-y-1 hover:border-[#99692E]"
                >
                  <div>
                    <Badge variant={categoryDetails.variant}>
                      {categoryDetails.label}
                    </Badge>

                    <h3 className="mt-5 text-xl font-bold uppercase leading-7 tracking-wider text-[#D9D9D9]">
                      {article.headline}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-[#737373]">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-auto border-t border-[#384A59] pt-5">
                    <Link
                      to="/news"
                      className="text-xs font-bold uppercase tracking-[0.2em] text-[#99692E] transition hover:text-[#D9D9D9]"
                    >
                      Read Full Report →
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-8 border border-[#384A59] bg-[#111519] p-6">
            <p className="leading-7 text-[#737373]">
              There are currently no active colonial broadcasts.
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link to="/news">
            <Button variant="outline">
              View Colonial News
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NewsSection