import { FieldDescription } from "@/components/ui/field"

export function SignUpPrompt() {
  return (
    <FieldDescription className="text-center">
      Don&apos;t have an account?{" "}
      <a href="#" className="underline underline-offset-4">
        Sign up
      </a>
    </FieldDescription>
  )
}