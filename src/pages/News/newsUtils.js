function hashString(value) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

function getDailySeed() {
  const now = new Date()

  return hashString(
    [
      now.getUTCFullYear(),
      String(now.getUTCMonth() + 1).padStart(2, "0"),
      String(now.getUTCDate()).padStart(2, "0"),
    ].join("-")
  )
}

function deterministicShuffle(items, seed) {
  return [...items]
    .map((item) => ({
      item,
      sortValue: hashString(`${item.id}-${seed}`),
    }))
    .sort((firstItem, secondItem) =>
      firstItem.sortValue - secondItem.sortValue
    )
    .map(({ item }) => item)
}

export function selectNewsForDisplay(
  articles,
  additionalArticleCount = 3
) {
  if (!articles.length) {
    return {
      featuredArticle: null,
      rotatingArticles: [],
    }
  }

  const dailySeed = getDailySeed()

  const featuredArticles = articles.filter(
    (article) => article.is_featured
  )

  const featuredArticle =
    featuredArticles.length > 0
      ? deterministicShuffle(featuredArticles, dailySeed)[0]
      : deterministicShuffle(articles, dailySeed)[0]

  const rotatingArticles = deterministicShuffle(
    articles.filter(
      (article) => article.id !== featuredArticle.id
    ),
    dailySeed + 17
  ).slice(0, additionalArticleCount)

  return {
    featuredArticle,
    rotatingArticles,
  }
}