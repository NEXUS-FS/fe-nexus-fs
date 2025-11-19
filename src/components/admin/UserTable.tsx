import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { EditUserModal } from './EditUserModal'
import { DeleteUserDialog } from './DeleteUserDialog'
import { useUserActions } from '@/hooks/admin/useUserActions'
import type { User, UserRoleType, UserStatusType, UpdateUserRequest } from '@/types'
import { UserRole as UserRoleConst, UserStatus as UserStatusConst } from '@/types'

interface UserTableProps {
  users: User[]
  isLoading: boolean
  onRefresh: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function UserTable({
  users,
  isLoading,
  onRefresh,
  searchQuery,
  onSearchChange,
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const { updateUser, deleteUser, changeUserRole, toggleUserStatus, isLoading: isActionLoading } =
    useUserActions()

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleEditSave = async (data: UpdateUserRequest) => {
    if (!selectedUser) return
    try {
      await updateUser(selectedUser.id, data)
      setIsEditModalOpen(false)
      setSelectedUser(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return
    try {
      await deleteUser(userToDelete.id)
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleRoleChange = async (userId: string, role: UserRoleType) => {
    try {
      await changeUserRole(userId, role)
      onRefresh()
    } catch (error) {
      console.error('Failed to change role:', error)
    }
  }

  const handleStatusToggle = async (userId: string, currentStatus: UserStatusType) => {
    const newStatus =
      currentStatus === UserStatusConst.ACTIVE
        ? UserStatusConst.INACTIVE
        : UserStatusConst.ACTIVE
    try {
      await toggleUserStatus(userId, newStatus)
      onRefresh()
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const getStatusBadgeVariant = (status: UserStatusType) => {
    return status === UserStatusConst.ACTIVE ? 'success' : 'secondary'
  }

  const getRoleBadgeVariant = (role: UserRoleType) => {
    return role === UserRoleConst.ADMIN ? 'default' : 'outline'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <div className="mb-4">
        <Input
          placeholder="Search by username or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">
                    {user.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        handleRoleChange(user.id, value as UserRoleType)
                      }
                      disabled={isActionLoading}
                    >
                      <SelectTrigger className="w-[120px]">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRoleConst.USER}>User</SelectItem>
                        <SelectItem value={UserRoleConst.ADMIN}>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusToggle(user.id, user.status)}
                      disabled={isActionLoading}
                    >
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell className="capitalize">{user.provider}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(user)}
                        disabled={isActionLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                        disabled={isActionLoading}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleEditSave}
        user={selectedUser}
        isLoading={isActionLoading}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setUserToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        userName={userToDelete?.username || ''}
        isLoading={isActionLoading}
      />
    </>
  )
}
