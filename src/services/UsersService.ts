import type { User, PaginatedResponse } from './dtos';

export class UsersService {
  private static readonly BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5035/api';

  static async getUsers(
    pageNumber: number = 1, 
    pageSize: number = 10, 
    token?: string
  ): Promise<PaginatedResponse<User>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.BASE_URL}/users/hybrid?includeClerkUsers=true&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaginatedResponse<User> = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(id: string, token?: string): Promise<User> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.BASE_URL}/users/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
}