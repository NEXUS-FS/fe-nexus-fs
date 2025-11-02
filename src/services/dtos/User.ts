export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  provider: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  lastLogin: string | null;
}