import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  FileText,
  Bell,
  Search,
  User,
  Settings,
  Github,
  LifeBuoy,
  Code,
  LogOut,
  Share2,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function AppHeader() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-12 lg:px-16">
        {/* Left side: Logo + Search */}
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="flex items-center">
            <img src="/logo-black.svg" alt="NexusFS" className="h-8 w-8" />
          </a>

          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Search Files"
              className="w-64 pl-3 pr-10 h-10 bg-background"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 h-10 w-10"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right side: Navigation + Avatar */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <a
              href="/dashboard"
              className={`flex items-center gap-2 text-sm transition-colors ${
                isActive('/dashboard')
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="font-mac-medium">Home</span>
            </a>
            <a
              href="/files"
              className={`flex items-center gap-2 text-sm transition-colors ${
                isActive('/files')
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="font-mac-medium">Files</span>
            </a>
            <a
              href="/shared"
              className={`flex items-center gap-2 text-sm transition-colors ${
                isActive('/shared')
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Share2 className="h-4 w-4" />
              <span className="font-mac-medium">Shared</span>
            </a>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4 w-4" />
              <span className="font-mac-medium">Notifications</span>
            </button>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Avatar className="h-9 w-9 bg-foreground cursor-pointer">
                  <AvatarImage src="" alt={user?.username || 'User'} />
                  <AvatarFallback className="bg-foreground text-background text-sm font-medium">
                    {user?.username ? getInitials(user.username) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <DropdownMenuLabel className="font-mac-medium">
                My account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="font-mac-medium"
                  onClick={() => navigate('/settings/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-mac-medium"
                  onClick={() => navigate('/settings/general')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="font-mac-medium">
                  <Github className="mr-2 h-4 w-4" />
                  <span>Github</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-mac-medium"
                  onClick={() => navigate('/settings/support')}
                >
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-mac-medium"
                  onClick={() => navigate('/settings/api')}
                >
                  <Code className="mr-2 h-4 w-4" />
                  <span>API</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="font-mac-medium"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
