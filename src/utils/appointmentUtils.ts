
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

export const getStatusBorderColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return '#3B82F6';
    case 'completed':
      return '#10B981';
    case 'cancelled':
      return '#EF4444';
    default:
      return '#E5E7EB';
  }
};
