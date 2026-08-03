function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#384A59] bg-[#111519]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#99692E]">
            Volsung Industries
          </p>

          <h2 className="mt-2 text-xl font-bold uppercase tracking-widest text-[#D9D9D9]">
            Industrial Registry
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-6 text-[#737373]">
            The central registry for personnel, factions, industrial licenses,
            and server operations within Volsung Origins.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#D9D9D9]">
            Registry
          </p>

          <nav className="mt-4 flex flex-col gap-3 text-sm uppercase tracking-wider text-[#737373]">
            <a className="transition hover:text-[#99692E]" href="/">
              Home
            </a>

            <a className="transition hover:text-[#99692E]" href="/factions">
              Factions
            </a>

            <a className="transition hover:text-[#99692E]" href="/login">
              Personnel Login
            </a>
          </nav>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#D9D9D9]">
            System Status
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-[#242C32] pb-3">
              <span className="text-[#737373]">Registry Network</span>
              <span className="font-bold uppercase text-green-400">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#242C32] pb-3">
              <span className="text-[#737373]">Application Version</span>
              <span className="font-bold text-[#D9D9D9]">0.1.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#242C32]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs uppercase tracking-wider text-[#737373] sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Volsung Industries</p>
          <p>Forged for Volsung Origins</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer