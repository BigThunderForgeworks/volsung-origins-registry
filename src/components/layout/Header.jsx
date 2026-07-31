function Header() {
  return (
    <header className="border-b border-[#384A59] bg-[#1D2328]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#99692E]">
            Volsung Origins
          </p>

          <h1 className="text-lg font-bold uppercase tracking-widest text-[#D9D9D9]">
            Industrial Registry
          </h1>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <button className="text-sm uppercase tracking-widest text-[#D9D9D9] hover:text-[#99692E] transition">
            Directory
          </button>

          <button className="text-sm uppercase tracking-widest text-[#737373] hover:text-[#99692E] transition">
            Licenses
          </button>

          <button className="text-sm uppercase tracking-widest text-[#737373] hover:text-[#99692E] transition">
            About
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header