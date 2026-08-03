const variants = {
  default:
    "border-[#384A59] bg-[#384A59]/20 text-[#D9D9D9]",
  gold:
    "border-[#99692E] bg-[#99692E]/15 text-[#C99A57]",
  success:
    "border-green-700 bg-green-900/20 text-green-400",
  danger:
    "border-red-700 bg-red-900/20 text-red-400",
  warning:
    "border-yellow-700 bg-yellow-900/20 text-yellow-400",
}

function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const variantClasses = variants[variant] ?? variants.default

  return (
    <span
      className={`
        inline-flex items-center
        border
        px-3 py-1
        text-xs font-bold uppercase tracking-widest
        ${variantClasses}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export default Badge