import { useQuery } from '@tanstack/react-query';
import { usersService, type UsersQuery } from '../services/users.service';

interface UseUsersWithFiltersProps {
  search: string;
  activeFilter: 'all' | 'active' | 'inactive';
  currentPage: number;
  pageSize: number;
}

export function useUsersWithFilters({
  search,
  activeFilter,
  currentPage,
  pageSize,
}: UseUsersWithFiltersProps) {
  // Build query object
  const query: UsersQuery = {
    page: currentPage,
    limit: pageSize,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  if (search.trim()) {
    query.search = search.trim();
  }

  if (activeFilter === 'active') {
    query.isActive = true;
  } else if (activeFilter === 'inactive') {
    query.isActive = false;
  }

  // Use React Query
  const queryResult = useQuery({
    queryKey: ['users', query],
    queryFn: () => usersService.getAll(query),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return queryResult;
}
