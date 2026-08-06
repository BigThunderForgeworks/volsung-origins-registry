function renderParagraphs(content, keyPrefix) {
  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={`${keyPrefix}-${index}`}>{paragraph}</p>
    ))
}

function LoreBlockRenderer({ block }) {
  const metadata = block.metadata ?? {}

  if (block.block_type === "classified_file") {
    return (
      <section className="border border-red-800 bg-red-950/20 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-900 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              {metadata.classification_label ?? "Classified File"}
            </p>

            <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider text-[#D9D9D9]">
              {block.heading}
            </h2>
          </div>

          {metadata.file_code && (
            <span className="font-mono text-xs uppercase tracking-widest text-red-400">
              {metadata.file_code}
            </span>
          )}
        </div>

        <div className="mt-6 space-y-5 leading-8 text-[#D9D9D9]">
          {renderParagraphs(block.content, block.id)}
        </div>
      </section>
    )
  }

  if (block.block_type === "objectives") {
    const items = Array.isArray(metadata.items)
      ? metadata.items
      : block.content
          .split(/\n+/)
          .map((item) => item.trim())
          .filter(Boolean)

    return (
      <section className="border border-[#384A59] bg-[#111519] p-6">
        {block.heading && (
          <h2 className="text-2xl font-bold uppercase tracking-wider text-[#D9D9D9]">
            {block.heading}
          </h2>
        )}

        <div className="mt-6 space-y-4">
          {items.map((item, index) => {
            const isObject =
              typeof item === "object" &&
              item !== null

            return (
              <div
                key={`${block.id}-${index}`}
                className="border-l-2 border-[#99692E] pl-4"
              >
                {isObject ? (
                  <>
                    <p className="font-bold uppercase tracking-wider text-[#D9D9D9]">
                      {item.title}
                    </p>

                    {item.description && (
                      <p className="mt-2 leading-7 text-[#737373]">
                        {item.description}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="leading-7 text-[#D9D9D9]">
                    {item}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  if (
    block.block_type === "quote" ||
    block.block_type === "broadcast" ||
    block.block_type === "closing_transmission"
  ) {
    return (
      <section className="border border-[#99692E] bg-[#99692E]/10 p-6">
        {block.heading && (
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#99692E]">
            {block.heading}
          </p>
        )}

        <div className="mt-5 space-y-5 text-lg italic leading-8 text-[#D9D9D9]">
          {renderParagraphs(block.content, block.id)}
        </div>
      </section>
    )
  }

  return (
    <section>
      {block.heading && (
        <h2 className="text-2xl font-bold uppercase tracking-wider text-[#D9D9D9]">
          {block.heading}
        </h2>
      )}

      <div className="mt-6 space-y-5 leading-8 text-[#B5B5B5]">
        {renderParagraphs(block.content, block.id)}
      </div>
    </section>
  )
}

export default LoreBlockRenderer