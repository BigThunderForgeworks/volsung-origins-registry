import { useState } from "react"
import { supabase } from "../../lib/supabase"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const authRedirectUrl = `${window.location.origin}${import.meta.env.BASE_URL}`

  async function handleDiscordLogin() {
    setMessage("")
    setErrorMessage("")
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: authRedirectUrl,
      },
    })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
    }
  }

  async function handleMagicLink(event) {
    event.preventDefault()

    setMessage("")
    setErrorMessage("")

    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setErrorMessage("Enter an email address.")
      return
    }

    setIsLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: authRedirectUrl,
      },
    })

    if (error) {
      setErrorMessage(error.message)
    } else {
      setMessage("Magic link sent. Check your email to continue.")
      setEmail("")
    }

    setIsLoading(false)
  }

  return (
    <section className="bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Personnel Authentication
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
            Access the Registry
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#737373]">
            Sign in with Discord or request a secure magic link by email.
            Your registry name can be edited separately from your Discord
            username.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card
            title="Discord Access"
            subtitle="Primary authentication"
          >
            <p className="leading-7 text-[#737373]">
              Use your Discord account to access the registry. Discord supplies
              your account identity and avatar, while your in-game character
              name remains separately editable.
            </p>

            <Button
              className="mt-8 w-full"
              disabled={isLoading}
              onClick={handleDiscordLogin}
            >
              {isLoading ? "Connecting..." : "Continue with Discord"}
            </Button>
          </Card>

          <Card
            title="Email Access"
            subtitle="Magic-link authentication"
          >
            <p className="leading-7 text-[#737373]">
              Enter your email address and Supabase will send you a one-time
              sign-in link. No password is required.
            </p>

            <form className="mt-8" onSubmit={handleMagicLink}>
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-[0.25em] text-[#D9D9D9]"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="pilot@example.com"
                autoComplete="email"
                className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-[#D9D9D9] outline-none transition placeholder:text-[#737373] focus:border-[#99692E]"
              />

              <Button
                type="submit"
                variant="secondary"
                className="mt-5 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>
          </Card>
        </div>

        {message && (
          <div className="mt-8 border border-green-700 bg-green-900/20 px-5 py-4 text-green-400">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mt-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
            {errorMessage}
          </div>
        )}
      </div>
    </section>
  )
}

export default LoginPage
