import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';
import {
  User,
  Settings,
  Cloud,
  Shield,
  Bell,
  Code,
  LifeBuoy,
} from 'lucide-react';

export interface SettingsNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const settingsNavItems: SettingsNavItem[] = [
  { id: 'profile', label: 'Profile', icon: User, path: '/settings/profile' },
  {
    id: 'general',
    label: 'General',
    icon: Settings,
    path: '/settings/general',
  },
  {
    id: 'providers',
    label: 'Providers',
    icon: Cloud,
    path: '/settings/providers',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    path: '/settings/security',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: '/settings/notifications',
  },
  { id: 'api', label: 'API', icon: Code, path: '/settings/api' },
  {
    id: 'support',
    label: 'Support',
    icon: LifeBuoy,
    path: '/settings/support',
  },
];

export function SettingsSidebar() {
  return (
    <nav className="w-full">
      <ul className="space-y-1">
        {settingsNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors',
                    isActive
                      ? 'bg-accent text-foreground font-mac-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
