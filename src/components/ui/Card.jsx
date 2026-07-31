function Card({
  children,
  title,
  subtitle,
  className = "",
}) {
  return (
    <div
      className={`
        border border-[#384A59]
        bg-[#1D2328]
        p-6
        transition-all
        duration-200
        hover:border-[#99692E]
        hover:shadow-lg
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {subtitle && (
            <p className="text-xs uppercase tracking-[0.3em] text-[#99692E]">
              {subtitle}
            </p>
          )}

          {title && (
            <h3 className="mt-1 text-2xl font-bold uppercase tracking-wider text-[#D9D9D9]">
              {title}
            </h3>
          )}
        </div>
      )}

      {children}
    </div>
  )
}

export default Card