
import { Stakeholder, MaterialityIssue } from '../types';

export const getStakeholderPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Alta': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'Media-alta': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'Media': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'Bassa': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

export const getSurveyStatusColor = (status?: string): string => {
  switch (status) {
    case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

export const getSurveyStatusText = (status?: string): string => {
  switch (status) {
    case 'sent': return 'Inviato';
    case 'completed': return 'Completato';
    default: return 'In attesa';
  }
};

export const calculatePriority = (influence: number, interest: number): string => {
  if (influence >= 70 && interest >= 70) return 'Alta';
  if (influence >= 70 || interest >= 70) return 'Media-alta';
  if (influence <= 30 && interest <= 30) return 'Bassa';
  return 'Media';
};

export const predefinedIssues = [
  { id: 'climate', name: 'Cambiamento climatico', description: 'Gestione delle emissioni di gas serra e degli impatti sul clima' },
  { id: 'pollution', name: 'Inquinamento', description: 'Prevenzione e controllo dell\'inquinamento di aria, acqua e suolo' },
  { id: 'resources', name: 'Uso delle risorse', description: 'Efficienza nell\'uso delle risorse e principi di economia circolare' },
  { id: 'biodiversity', name: 'Biodiversità', description: 'Protezione e ripristino della biodiversità e degli ecosistemi' },
  { id: 'water', name: 'Gestione delle risorse idriche', description: 'Uso sostenibile e protezione delle risorse idriche' },
  { id: 'labor', name: 'Condizioni di lavoro', description: 'Condizioni di lavoro dignitose, inclusi salari, orari e diritti dei lavoratori' },
  { id: 'equality', name: 'Uguaglianza e non discriminazione', description: 'Promozione della parità di trattamento e opportunità' },
  { id: 'health', name: 'Salute e sicurezza', description: 'Protezione della salute e sicurezza dei lavoratori e consumatori' },
  { id: 'community', name: 'Impatti sulla comunità', description: 'Gestione degli impatti sulle comunità locali e relazioni con stakeholder' },
  { id: 'conduct', name: 'Etica aziendale', description: 'Prevenzione della corruzione, pratiche anti-concorrenziali e fiscalità' }
];

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
