import { Link, useNavigate } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

export default function PageNotFound() {
  const navigate = useNavigate()

  return (
    <div data-testid="not-found-page" className="grid min-h-svh w-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-8xl font-mac-semibold tracking-tighter">404</h1>
              <h2 className="text-2xl font-mac-semibold tracking-tight">
                Page not found!
              </h2>
              <p className="text-muted-foreground font-mac-regular">
                Sorry, the page you want to access does no longer exists or have been moved.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-mac-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-2.5 text-sm font-mac-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#131313] hidden lg:flex justify-center items-center relative">
        <div className="absolute top-5 left-5">
          <a href="/dashboard" className="flex items-center gap-2 text-2xl font-mac-semibold text-white tracking-tighter">
            NexusFS
          </a>
        </div>
        <div className="absolute bottom-5 left-4">
          <p className="flex items-center gap-2 font-mac-medium text-sm text-white opacity-60">
            &#169; NexusFS 2025. All rights reserved.
          </p>
        </div>
        <img src="/logo-white.svg" alt="Logo NexusFS" className="opacity-20" />
      </div>
    </div>
  )
}