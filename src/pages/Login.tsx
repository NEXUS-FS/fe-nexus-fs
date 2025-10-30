import { LoginForm } from "@/components/auth/LoginForm"

export default function Login() {
  return (
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-[#131313] hidden lg:flex justify-center items-center relative">
        <div className="absolute top-5 left-5">
          <a href="#" className="flex items-center gap-2 text-2xl font-general-semibold text-white tracking-tighter">
            NexusFS
          </a>
        </div>
        <div className="absolute bottom-5 left-4">
          <p className="flex items-center gap-2 font-general-medium text-sm text-white opacity-60">
            &#169; NexusFS 2025. All rights reserved.
          </p>
        </div>
        <img src="/logo-white.svg" alt="Logo NexusFS" />
      </div>
    </div>
  )
}
