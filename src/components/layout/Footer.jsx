import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { supabase } from "../../lib/supabase"

function Footer() {
  const currentYear = new Date().getFullYear()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null

      setUser(currentUser)

      if (currentUser) {
        loadProfile(currentUser.id)
      } else {
        setProfile(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadSession() {
    setIsLoading(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const currentUser = session?.user ?? null

    setUser(currentUser)

    if (currentUser) {
      await loadProfile(currentUser.id)
    } else {
      setProfile(null)
      setIsLoading(false)
    }
  }

  async function loadProfile(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle()

    setProfile(data ?? null)
    setIsLoading(false)
  }

  function FooterLink({ to, children }) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `transition ${
            isActive
              ? "text-[#99692E]"
              : "text-[#737373] hover:text-[#99692E]"
          }`
        }
      >
        {children}
      </NavLink>
    )
  }

  return (
    <footer className="border-t border-[#384A59] bg-[#111519]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-3">
        <div>
          <Link to="/">
            <p className="text-xs uppercase tracking-[0.35em] text-[#99692E]">
              Volsung Industries
            </p>

            <h2 className="mt-2 text-xl font-bold uppercase tracking-widest text-[#D9D9D9]">
              Industrial Registry
            </h2>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-[#737373]">
            The official personnel, faction, licensing, and industrial registry
            for the Volsung Origins Space Engineers server.
          </p>

          <p className="mt-5 max-w-sm text-xs uppercase tracking-[0.18em] text-[#737373]">
            Designed and developed by{" "}
            <span className="text-[#99692E]">
              Big Thunder Forgeworks
            </span>
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#D9D9D9]">
            Registry Navigation
          </p>

          <nav className="mt-4 flex flex-col gap-3 text-sm uppercase tracking-wider">
            <FooterLink to="/">Home</FooterLink>

            <FooterLink to="/factions">Factions</FooterLink>

            <FooterLink to="/licenses">Licenses</FooterLink>

            <FooterLink to="/news">Colonial News</FooterLink>

            <FooterLink to="/lore">
              Lore Archive
            </FooterLink>

            {!isLoading && !user && (
              <FooterLink to="/login">
                Login
              </FooterLink>
            )}

            {!isLoading && user && (
              <FooterLink to="/dashboard">
                Dashboard
              </FooterLink>
            )}

            {!isLoading &&
              user &&
              profile?.role === "admin" && (
                <FooterLink to="/admin">
                  Administration
                </FooterLink>
              )}
          </nav>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#D9D9D9]">
            System Status
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-[#242C32] pb-3">
              <span className="text-[#737373]">
                Registry Network
              </span>

              <span className="font-bold uppercase text-green-400">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#242C32] pb-3">
              <span className="text-[#737373]">
                Authentication
              </span>

              <span className="font-bold text-[#D9D9D9]">
                {user ? "Authenticated" : "Guest"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#242C32] pb-3">
              <span className="text-[#737373]">
                Registry Backend
              </span>

              <span className="font-bold text-[#D9D9D9]">
                Supabase
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#242C32] pb-3">
              <span className="text-[#737373]">
                News Feed
              </span>

              <span className="font-bold uppercase text-green-400">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#737373]">
                Version
              </span>

              <span className="font-bold text-[#99692E]">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#242C32]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs uppercase tracking-wider text-[#737373] sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Volsung Industries</p>

          <p>Forged by Big Thunder Forgeworks</p>

          <p>Powered by React • Supabase</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer