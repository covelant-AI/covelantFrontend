import { AnalysisStatus } from '@/util/interfaces';

interface StatusTagProps {
  analysisStatus: AnalysisStatus | null | undefined;
  className?: string;
}

export default function StatusTag({ analysisStatus, className = '' }: StatusTagProps) {
  if (!analysisStatus) {
    return null;
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500 text-white';
      case 'FAILED':
        return 'bg-red-500 text-white';
      case 'IN_PROGRESS':
        return 'bg-blue-500 text-white';
      case 'IN_QUEUE':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ');
  };

  return (
    <div
      className={`px-2 py-1 rounded-md text-xs font-semibold z-10 ${getStatusStyles(analysisStatus.status)} ${className}`}
    >
      {getStatusText(analysisStatus.status)}
    </div>
  );
}

