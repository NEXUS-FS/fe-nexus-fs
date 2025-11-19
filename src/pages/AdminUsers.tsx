import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserTable } from '@/components/admin/UserTable'
import { Pagination } from '@/components/admin/Pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUsers } from '@/hooks/admin/useUsers'
import { AlertCircle } from 'lucide-react'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const {
    users,
    pagination,
    isLoading,
    error,
    goToPage,
    setSearchQuery,
    refetch,
  } = useUsers({ page: 1, limit: 10 })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Apply debounced search
  useEffect(() => {
    setSearchQuery(debouncedSearch)
  }, [debouncedSearch, setSearchQuery])

  // Handle 403 errors (non-admin users)
  useEffect(() => {
    if (error && error.includes('403')) {
      navigate('/')
    }
  }, [error, navigate])

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage all users in the system
          </p>
        </CardHeader>
        <CardContent>
          {error && !error.includes('403') && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <UserTable
            users={users}
            isLoading={isLoading}
            onRefresh={refetch}
            searchQuery={searchInput}
            onSearchChange={setSearchInput}
          />

          {!isLoading && users.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={goToPage}
                isLoading={isLoading}
              />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Showing {users.length} of {pagination.totalItems} users
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
