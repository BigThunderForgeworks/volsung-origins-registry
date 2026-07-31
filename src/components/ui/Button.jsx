const variants = {
  primary:
    "border-[#99692E] bg-[#99692E] text-[#171B1F] hover:bg-transparent hover:text-[#D9D9D9]",
  secondary:
    "border-[#384A59] bg-[#384A59] text-[#D9D9D9] hover:bg-transparent",
  outline:
    "border-[#737373] bg-transparent text-[#D9D9D9] hover:border-[#99692E] hover:text-[#99692E]",
  danger:
    "border-red-700 bg-red-700 text-white hover:bg-transparent hover:text-red-400",
}

function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
  onClick,
}) {
  const variantClasses = variants[variant] ?? variants.primary

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        border px-8 py-3 font-bold uppercase tracking-widest transition
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantClasses}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default Button