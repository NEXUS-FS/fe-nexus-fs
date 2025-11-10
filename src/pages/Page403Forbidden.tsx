import { Link } from "react-router-dom"

export default function ForbiddenPage() {
  return (
    <div
      data-testid="forbidden-page"
      className="grid min-h-svh w-full place-items-center bg-[#131313] text-white p-6 relative"
    >
      <div className="text-center">
        <h1 className="text-8xl font-bold tracking-tight mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Access Forbidden</h2>
        <p className="text-white/70 mb-8">
          You don’t have permission to access this page.
        </p>

        {/* Go Home button → Dashboard */}
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 bg-white text-[#131313] rounded-lg font-medium hover:bg-white/90 transition"
        >
          Go back home
        </Link>
      </div>

      {/* Logo → Dashboard */}
      <div className="absolute top-5 left-5">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-2xl font-general-semibold text-white tracking-tighter"
        >
          NexusFS
        </Link>
      </div>

      <div className="absolute bottom-5 left-4">
        <p className="font-general-medium text-sm text-white opacity-60">
          &#169; NexusFS 2025. All rights reserved.
        </p>
      </div>
    </div>
  )
}