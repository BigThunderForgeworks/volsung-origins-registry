import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { supabase } from "../../lib/supabase"

function Header() {
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

    return () => {
      subscription.unsubscribe()
    }
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

  function getNavClass({ isActive }) {
    return `text-sm uppercase tracking-widest transition ${
      isActive
        ? "text-[#99692E]"
        : "text-[#737373] hover:text-[#99692E]"
    }`
  }

  return (
    <header className="border-b border-[#384A59] bg-[#1D2328]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-[#99692E]">
            Volsung Origins
          </p>

          <h1 className="text-lg font-bold uppercase tracking-widest text-[#D9D9D9]">
            Industrial Registry
          </h1>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={getNavClass}>
            Home
          </NavLink>

          <NavLink to="/factions" className={getNavClass}>
            Factions
          </NavLink>

          <NavLink to="/licenses" className={getNavClass}>
            Licenses
          </NavLink>

          <NavLink to="/news" className={getNavClass}>
            News
          </NavLink>

          <NavLink to="/lore" className={getNavClass}>
            Lore
          </NavLink>

          {!isLoading && !user && (
            <NavLink to="/login" className={getNavClass}>
              Login
            </NavLink>
          )}

          {!isLoading && user && (
            <NavLink to="/dashboard" className={getNavClass}>
              Dashboard
            </NavLink>
          )}

          {!isLoading && user && profile?.role === "admin" && (
            <NavLink to="/admin" className={getNavClass}>
              Administration
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header