import { useQuery } from '@tanstack/react-query';
import { classesService } from '../services/classes.service';

export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: () => classesService.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes - classes don't change often
    refetchOnWindowFocus: false,
  });
};

export const useClasse = (id: string) => {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: () => classesService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
