import { Button } from "@/components/ui/button"

interface SocialLoginButtonProps {
  provider: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function SocialLoginButton({ 
  provider, 
  icon, 
  onClick,
  disabled 
}: SocialLoginButtonProps) {
  return (
    <Button 
      variant="outline" 
      type="button" 
      onClick={onClick}
      disabled={disabled}
      className="font-general-medium"
    >
      {icon}
      Login with {provider}
    </Button>
  )
}