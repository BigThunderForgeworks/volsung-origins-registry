import { useEffect, useState } from "react"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"
import NewsArticleCard from "./NewsArticleCard"
import { selectNewsForDisplay } from "./newsUtils"

function NewsPage() {
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
        body,
        category,
        source_name,
        status,
        is_featured,
        published_at,
        factions (
          id,
          name,
          short_name
        )
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Receiving Colonial Broadcast
            </p>
          </Card>
        </div>
      </main>
    )
  }

  const {
    featuredArticle,
    rotatingArticles,
  } = selectNewsForDisplay(articles, 3)

  return (
    <main className="min-h-screen bg-[#171B1F] text-[#D9D9D9]">
      <section className="border-b border-[#384A59] bg-[#1D2328] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Frontier Broadcast Service
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider sm:text-6xl">
            Colonial News Network
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#737373]">
            Reporting industrial developments, security advisories,
            exploration activity, registry notices, and commercial updates
            from across the frontier.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-2 w-2 bg-green-400" />

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-400">
              Broadcast Feed Online
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {errorMessage && (
            <div className="mb-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
              {errorMessage}
            </div>
          )}

          {featuredArticle ? (
            <>
              <div className="mb-10">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
                  Featured Transmission
                </p>

                <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider">
                  Priority Report
                </h2>
              </div>

              <NewsArticleCard
                article={featuredArticle}
                featured
              />

              <div className="mb-8 mt-16 border-b border-[#384A59] pb-6">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
                  Rotating Broadcasts
                </p>

                <h2 className="mt-2 text-3xl font-bold uppercase tracking-wider">
                  Current Reports
                </h2>

                <p className="mt-3 text-sm uppercase tracking-widest text-[#737373]">
                  Showing {rotatingArticles.length} selected broadcasts
                </p>
              </div>

              <div className="space-y-6">
                {rotatingArticles.map((article) => (
                  <NewsArticleCard
                    key={article.id}
                    article={article}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card
              title="No Active Broadcasts"
              subtitle="Colonial News Network"
            >
              <p className="leading-7 text-[#737373]">
                There are currently no published colonial reports available.
                Please check the broadcast feed again later.
              </p>
            </Card>
          )}
        </div>
      </section>
    </main>
  )
}

export default NewsPage