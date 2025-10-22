import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RaidAttendanceService } from '@/services/raid-attendance.service';

const QUERY_KEYS = {
  attendance: (raidInstanceId: string) => ['raid-attendance', raidInstanceId],
  auditStatus: (raidInstanceId: string) => ['raid-audit-status', raidInstanceId],
};

/**
 * Hook to confirm attendance with image upload
 */
export function useConfirmAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      raidInstanceId,
      participantId,
      file,
    }: {
      raidInstanceId: string;
      participantId: string;
      file: File;
    }) =>
      RaidAttendanceService.confirmAttendance(
        raidInstanceId,
        participantId,
        file
      ),
    onSuccess: (_, variables) => {
      // Invalidate attendance list and audit status
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.attendance(variables.raidInstanceId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.auditStatus(variables.raidInstanceId),
      });
    },
  });
}

/**
 * Hook to get attendance confirmations
 */
export function useAttendanceConfirmations(raidInstanceId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.attendance(raidInstanceId),
    queryFn: () => RaidAttendanceService.getAttendanceConfirmations(raidInstanceId),
    enabled: !!raidInstanceId,
  });
}

/**
 * Hook to remove attendance confirmation
 */
export function useRemoveAttendanceConfirmation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      raidInstanceId,
      participantId,
    }: {
      raidInstanceId: string;
      participantId: string;
    }) =>
      RaidAttendanceService.removeConfirmation(raidInstanceId, participantId),
    onSuccess: (_, variables) => {
      // Invalidate attendance list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.attendance(variables.raidInstanceId),
      });
    },
  });
}

/**
 * Hook to get audit status
 */
export function useAuditStatus(raidInstanceId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.auditStatus(raidInstanceId),
    queryFn: () => RaidAttendanceService.getAuditStatus(raidInstanceId),
    enabled: !!raidInstanceId,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

/**
 * Hook to audit raid instance
 */
export function useAuditRaidInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      raidInstanceId,
      notes,
    }: {
      raidInstanceId: string;
      notes?: string;
    }) => RaidAttendanceService.auditRaidInstance(raidInstanceId, notes),
    onSuccess: (_, variables) => {
      // Invalidate both attendance and audit status
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.attendance(variables.raidInstanceId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.auditStatus(variables.raidInstanceId),
      });
      // Invalidate raid instances query to update the audit status badge on raid detail page
      queryClient.invalidateQueries({
        queryKey: ['raid-instances'],
      });
      // Also invalidate the specific raid instance query
      queryClient.invalidateQueries({
        queryKey: ['raid-instances', variables.raidInstanceId],
      });
    },
  });
}

