
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

// Updated predefined issues based on ESRS themes
export const predefinedIssues = [
  // Cambiamenti climatici
  { id: 'climate-adaptation', name: 'Adattamento ai cambiamenti climatici', description: 'Strategie e misure per adattarsi ai cambiamenti climatici' },
  { id: 'climate-mitigation', name: 'Mitigazione dei cambiamenti climatici', description: 'Riduzione delle emissioni di gas serra e altri interventi per mitigare i cambiamenti climatici' },
  { id: 'energy', name: 'Energia', description: 'Uso e gestione dell\'energia, inclusa efficienza energetica e fonti rinnovabili' },
  
  // Inquinamento
  { id: 'pollution-air', name: 'Inquinamento dell\'aria', description: 'Emissioni in atmosfera e impatti sulla qualità dell\'aria' },
  { id: 'pollution-water', name: 'Inquinamento dell\'acqua', description: 'Scarichi idrici e impatti sulla qualità dell\'acqua' },
  { id: 'pollution-soil', name: 'Inquinamento del suolo', description: 'Contaminazione del suolo e impatti sulla qualità del terreno' },
  { id: 'pollution-organisms', name: 'Inquinamento di organismi viventi e risorse alimentari', description: 'Impatti dell\'inquinamento sugli organismi viventi e sulla catena alimentare' },
  { id: 'substances-concern', name: 'Sostanze preoccupanti', description: 'Gestione e riduzione delle sostanze preoccupanti nei processi produttivi e nei prodotti' },
  { id: 'substances-extreme-concern', name: 'Sostanze estremamente preoccupanti', description: 'Gestione e eliminazione delle sostanze estremamente preoccupanti (SVHC)' },
  
  // Acque e risorse marine
  { id: 'water-consumption', name: 'Consumo idrico', description: 'Utilizzo e consumo di risorse idriche' },
  { id: 'water-withdrawal', name: 'Prelievi idrici', description: 'Prelievo di acqua da diverse fonti' },
  { id: 'water-discharge', name: 'Scarichi di acque', description: 'Gestione degli scarichi idrici e del loro impatto ambientale' },
  { id: 'ocean-discharge', name: 'Scarichi di acque negli oceani', description: 'Impatti degli scarichi idrici sugli ecosistemi marini' },
  { id: 'marine-resources', name: 'Estrazione e uso di risorse marine', description: 'Utilizzo sostenibile delle risorse marine' },
  
  // Biodiversità ed ecosistemi
  { id: 'biodiversity-climate', name: 'Biodiversità: Cambiamenti climatici', description: 'Impatti dei cambiamenti climatici sulla biodiversità' },
  { id: 'biodiversity-land-use', name: 'Biodiversità: Cambiamento di uso del suolo e dell\'acqua', description: 'Impatti del cambiamento di uso del suolo, dell\'acqua dolce e del mare sulla biodiversità' },
  { id: 'biodiversity-exploitation', name: 'Biodiversità: Sfruttamento diretto', description: 'Impatti dello sfruttamento diretto delle risorse naturali sulla biodiversità' },
  { id: 'biodiversity-invasive', name: 'Biodiversità: Specie esotiche invasive', description: 'Impatti delle specie esotiche invasive sugli ecosistemi locali' },
  { id: 'biodiversity-pollution', name: 'Biodiversità: Inquinamento', description: 'Impatti dell\'inquinamento sulla biodiversità' },
  { id: 'soil-degradation', name: 'Degrado del suolo', description: 'Processi di degrado del suolo e misure di mitigazione' },
  { id: 'desertification', name: 'Desertificazione', description: 'Processi di desertificazione e misure di contrasto' },
  { id: 'soil-sealing', name: 'Impermeabilizzazione del suolo', description: 'Impatti dell\'impermeabilizzazione del suolo e misure di mitigazione' },
  { id: 'ecosystem-services', name: 'Servizi ecosistemici', description: 'Impatti e dipendenze in termini di servizi ecosistemici' },
  
  // Economia circolare
  { id: 'resource-inflows', name: 'Afflussi di risorse', description: 'Gestione degli afflussi di risorse, compreso l\'uso efficiente delle risorse' },
  { id: 'resource-outflows', name: 'Deflussi di risorse', description: 'Gestione dei deflussi di risorse connessi a prodotti e servizi' },
  { id: 'waste', name: 'Rifiuti', description: 'Gestione dei rifiuti e strategie di riduzione' },
  
  // Forza lavoro propria
  { id: 'labor-conditions', name: 'Condizioni di lavoro', description: 'Condizioni di lavoro dignitose, inclusi salari, orari e diritti dei lavoratori' },
  { id: 'labor-safety', name: 'Salute e sicurezza sul lavoro', description: 'Protezione della salute e sicurezza dei lavoratori' },
  { id: 'labor-equality', name: 'Parità di trattamento e opportunità', description: 'Promozione della parità di trattamento e di opportunità per tutti i lavoratori' },
  { id: 'labor-rights', name: 'Altri diritti connessi al lavoro', description: 'Protezione di altri diritti fondamentali connessi al lavoro' },
  
  // Lavoratori nella catena del valore
  { id: 'supply-labor-conditions', name: 'Condizioni di lavoro nella catena del valore', description: 'Condizioni di lavoro dei lavoratori nella catena di fornitura' },
  { id: 'supply-labor-equality', name: 'Parità nella catena del valore', description: 'Parità di trattamento e di opportunità nella catena di fornitura' },
  { id: 'supply-labor-rights', name: 'Diritti dei lavoratori nella catena del valore', description: 'Protezione dei diritti dei lavoratori nella catena di fornitura' },
  
  // Comunità interessate
  { id: 'community-rights', name: 'Diritti economici, sociali e culturali delle comunità', description: 'Rispetto dei diritti economici, sociali e culturali delle comunità locali' },
  { id: 'community-civil-rights', name: 'Diritti civili e politici delle comunità', description: 'Rispetto dei diritti civili e politici delle comunità locali' },
  { id: 'indigenous-rights', name: 'Diritti dei popoli indigeni', description: 'Rispetto dei diritti dei popoli indigeni' },
  
  // Consumatori e utilizzatori finali
  { id: 'consumer-information', name: 'Impatti legati alle informazioni per i consumatori', description: 'Gestione delle informazioni fornite ai consumatori e/o agli utilizzatori finali' },
  { id: 'consumer-safety', name: 'Sicurezza personale dei consumatori', description: 'Protezione della sicurezza personale dei consumatori e/o degli utilizzatori finali' },
  { id: 'consumer-inclusion', name: 'Inclusione sociale dei consumatori', description: 'Promozione dell\'inclusione sociale dei consumatori e/o degli utilizzatori finali' },
  
  // Condotta delle imprese
  { id: 'business-culture', name: 'Cultura d\'impresa', description: 'Promozione di una cultura d\'impresa etica e responsabile' },
  { id: 'whistleblower-protection', name: 'Protezione degli informatori', description: 'Misure per la protezione degli informatori (whistleblower)' },
  { id: 'animal-welfare', name: 'Benessere degli animali', description: 'Protezione del benessere degli animali' },
  { id: 'political-engagement', name: 'Impegno politico e attività di lobbying', description: 'Gestione responsabile dell\'impegno politico e delle attività di lobbying' },
  { id: 'supplier-relations', name: 'Gestione dei rapporti con i fornitori', description: 'Gestione dei rapporti con i fornitori, comprese le prassi di pagamento' },
  { id: 'corruption', name: 'Corruzione attiva e passiva', description: 'Prevenzione e contrasto della corruzione attiva e passiva' }
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

// Temi principali ESRS per categorizzazione
export const esrsThemes = [
  "Cambiamenti climatici",
  "Inquinamento",
  "Acque e risorse marine",
  "Biodiversità ed ecosistemi",
  "Economia circolare",
  "Forza lavoro propria",
  "Lavoratori nella catena del valore",
  "Comunità interessate",
  "Consumatori e utilizzatori finali",
  "Condotta delle imprese"
];
