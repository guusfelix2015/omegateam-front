import { api } from '@/lib/axios';
import type {
  AttendanceConfirmation,
  AttendanceList,
  AuditStatus,
  AuditResult,
} from '@/types/api';

export class RaidAttendanceService {
  /**
   * Confirm attendance with image upload
   */
  static async confirmAttendance(
    raidInstanceId: string,
    participantId: string,
    file: File
  ): Promise<AttendanceConfirmation> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ data: AttendanceConfirmation }>(
      `/raid-instances/${raidInstanceId}/attendance/confirm?participantId=${participantId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  }

  /**
   * Get attendance confirmations for a raid instance
   */
  static async getAttendanceConfirmations(
    raidInstanceId: string
  ): Promise<AttendanceList> {
    const response = await api.get<AttendanceList>(
      `/raid-instances/${raidInstanceId}/attendance`
    );

    return response.data;
  }

  /**
   * Remove attendance confirmation (admin only)
   */
  static async removeConfirmation(
    raidInstanceId: string,
    participantId: string
  ): Promise<void> {
    await api.delete(
      `/raid-instances/${raidInstanceId}/attendance/${participantId}`
    );
  }

  /**
   * Get audit status for a raid instance
   */
  static async getAuditStatus(raidInstanceId: string): Promise<AuditStatus> {
    const response = await api.get<{ data: AuditStatus }>(
      `/raid-instances/${raidInstanceId}/audit-status`
    );

    return response.data.data;
  }

  /**
   * Audit raid instance and distribute DKP (admin only)
   */
  static async auditRaidInstance(
    raidInstanceId: string,
    notes?: string
  ): Promise<AuditResult> {
    const response = await api.post<{ data: AuditResult }>(
      `/raid-instances/${raidInstanceId}/audit`,
      { notes }
    );

    return response.data.data;
  }
}

