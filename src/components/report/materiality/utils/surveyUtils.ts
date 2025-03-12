
export const getSurveyStatusColor = (status?: string): string => {
  switch (status) {
    case 'sent': return 'bg-blue-600 text-white font-medium dark:bg-blue-700 dark:text-white';
    case 'completed': return 'bg-green-600 text-white font-medium dark:bg-green-700 dark:text-white';
    default: return 'bg-gray-600 text-white font-medium dark:bg-gray-700 dark:text-white';
  }
};

export const getSurveyStatusText = (status?: string): string => {
  switch (status) {
    case 'sent': return 'Inviato';
    case 'completed': return 'Completato';
    default: return 'In attesa';
  }
};
