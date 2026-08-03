import { Link } from "react-router-dom"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
      <div className="mx-auto max-w-4xl">
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Registry Error 404
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
            Record Not Found
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-[#737373]">
            The requested registry record could not be located. It may have
            been removed, renamed, or the address may be incorrect.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/">
              <Button>Return Home</Button>
            </Link>

            <Link to="/factions">
              <Button variant="outline">Browse Factions</Button>
            </Link>

            <Link to="/licenses">
              <Button variant="secondary">Browse Licenses</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default NotFoundPage