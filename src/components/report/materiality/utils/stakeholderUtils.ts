
export const getStakeholderPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Alta': return 'bg-red-600 text-white font-medium dark:bg-red-700 dark:text-white';
    case 'Media-alta': return 'bg-orange-500 text-white font-medium dark:bg-orange-600 dark:text-white';
    case 'Media': return 'bg-blue-600 text-white font-medium dark:bg-blue-700 dark:text-white';
    case 'Bassa': return 'bg-green-600 text-white font-medium dark:bg-green-700 dark:text-white';
    default: return 'bg-gray-600 text-white font-medium dark:bg-gray-700 dark:text-white';
  }
};

export const calculatePriority = (influence: number, interest: number): string => {
  if (influence >= 70 && interest >= 70) return 'Alta';
  if (influence >= 70 || interest >= 70) return 'Media-alta';
  if (influence <= 30 && interest <= 30) return 'Bassa';
  return 'Media';
};

export const stakeholderCategories = [
  "Dipendenti",
  "Clienti",
  "Fornitori",
  "Azionisti/Investitori",
  "Comunità locale",
  "Organizzazioni non governative",
  "Autorità pubbliche",
  "Media",
  "Sindacati",
  "Partner commerciali",
  "Altro"
];
