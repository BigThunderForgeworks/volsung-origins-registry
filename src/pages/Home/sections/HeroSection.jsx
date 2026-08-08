import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Button from "../../../components/ui/Button"
import { supabase } from "../../../lib/supabase"

function HeroSection() {
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
      .select("role, character_name")
      .eq("id", userId)
      .maybeSingle()

    setProfile(data ?? null)
    setIsLoading(false)
  }

  const clearance = isLoading
    ? "VERIFYING"
    : !user
      ? "GUEST"
      : profile?.role === "admin"
        ? "ADMINISTRATOR"
        : "PLAYER"

  const authenticationStatus = user
    ? "AUTHENTICATED"
    : "DISCORD / EMAIL"

  return (
    <section className="relative overflow-hidden border-b border-[#384A59] bg-[#22282D]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#384A59 1px, transparent 1px), linear-gradient(90deg, #384A59 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto grid min-h-[520px] max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-2 w-2 bg-green-400" />

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
              Registry Network Online
            </p>
          </div>

          <p className="text-sm uppercase tracking-[0.4em] text-[#737373]">
            Volsung Industries
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-bold uppercase leading-none tracking-[0.1em] text-[#D9D9D9] sm:text-7xl lg:text-8xl">
            Industrial Registry
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A6A6A6]">
            Access the central personnel, faction, company, and licensing network for
            the Volsung Origins server.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button className="w-full sm:w-auto">
                    Open Dashboard
                  </Button>
                </Link>

                {profile?.role === "admin" && (
                  <Link to="/admin">
                    <Button
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      Open Administration
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className="w-full sm:w-auto">
                    Continue with Discord
                  </Button>
                </Link>

                <Link to="/login">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Continue with Email
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="border border-[#384A59] bg-[#171B1F]/90 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#99692E]">
            Terminal Access
          </p>

          <div className="mt-6 space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-[#242C32] pb-3">
              <span className="text-[#737373]">Network</span>
              <span className="text-green-400">ONLINE</span>
            </div>

            <div className="flex justify-between border-b border-[#242C32] pb-3">
              <span className="text-[#737373]">Authentication</span>
              <span className="text-[#D9D9D9]">
                {authenticationStatus}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#242C32] pb-3">
              <span className="text-[#737373]">Registry</span>
              <span className="text-[#D9D9D9]">PUBLIC</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#737373]">Clearance</span>
              <span className="text-[#99692E]">{clearance}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection