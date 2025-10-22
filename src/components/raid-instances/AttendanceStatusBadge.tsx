import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';

interface AttendanceStatusBadgeProps {
  status: 'confirmed' | 'pending';
  uploadedAt?: string | null;
}

export function AttendanceStatusBadge({
  status,
  uploadedAt,
}: AttendanceStatusBadgeProps) {
  if (status === 'confirmed') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmado
        </Badge>
        {uploadedAt && (
          <span className="text-xs text-gray-500">
            {new Date(uploadedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    );
  }

  return (
    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
      <Clock className="w-3 h-3 mr-1" />
      Pendente
    </Badge>
  );
}

