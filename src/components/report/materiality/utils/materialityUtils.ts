import { Stakeholder, MaterialityIssue } from '../types';

export const getStakeholderPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Alta': return 'bg-red-600 text-white font-medium dark:bg-red-700 dark:text-white';
    case 'Media-alta': return 'bg-orange-500 text-white font-medium dark:bg-orange-600 dark:text-white';
    case 'Media': return 'bg-blue-600 text-white font-medium dark:bg-blue-700 dark:text-white';
    case 'Bassa': return 'bg-green-600 text-white font-medium dark:bg-green-700 dark:text-white';
    default: return 'bg-gray-600 text-white font-medium dark:bg-gray-700 dark:text-white';
  }
};

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

export const calculatePriority = (influence: number, interest: number): string => {
  if (influence >= 70 && interest >= 70) return 'Alta';
  if (influence >= 70 || interest >= 70) return 'Media-alta';
  if (influence <= 30 && interest <= 30) return 'Bassa';
  return 'Media';
};

export const predefinedIssues = [
  { id: 'climate-adaptation', name: 'Adattamento ai cambiamenti climatici', description: 'Strategie e misure per adattarsi ai cambiamenti climatici' },
  { id: 'climate-mitigation', name: 'Mitigazione dei cambiamenti climatici', description: 'Riduzione delle emissioni di gas serra e altri interventi per mitigare i cambiamenti climatici' },
  { id: 'energy', name: 'Energia', description: 'Uso e gestione dell\'energia, inclusa efficienza energetica e fonti rinnovabili' },
  
  { id: 'pollution-air', name: 'Inquinamento dell\'aria', description: 'Emissioni in atmosfera e impatti sulla qualità dell\'aria' },
  { id: 'pollution-water', name: 'Inquinamento dell\'acqua', description: 'Scarichi idrici e impatti sulla qualità dell\'acqua' },
  { id: 'pollution-soil', name: 'Inquinamento del suolo', description: 'Contaminazione del suolo e impatti sulla qualità del terreno' },
  { id: 'pollution-organisms', name: 'Inquinamento di organismi viventi e risorse alimentari', description: 'Impatti dell\'inquinamento sugli organismi viventi e sulla catena alimentare' },
  { id: 'substances-concern', name: 'Sostanze preoccupanti', description: 'Gestione e riduzione delle sostanze preoccupanti nei processi produttivi e nei prodotti' },
  { id: 'substances-extreme-concern', name: 'Sostanze estremamente preoccupanti', description: 'Gestione e eliminazione delle sostanze estremamente preoccupanti (SVHC)' },
  
  { id: 'water-consumption', name: 'Consumo idrico', description: 'Utilizzo e consumo di risorse idriche' },
  { id: 'water-withdrawal', name: 'Prelievi idrici', description: 'Prelievo di acqua da diverse fonti' },
  { id: 'water-discharge', name: 'Scarichi di acque', description: 'Gestione degli scarichi idrici e del loro impatto ambientale' },
  { id: 'ocean-discharge', name: 'Scarichi di acque negli oceani', description: 'Impatti degli scarichi idrici sugli ecosistemi marini' },
  { id: 'marine-resources', name: 'Estrazione e uso di risorse marine', description: 'Utilizzo sostenibile delle risorse marine' },
  
  { id: 'biodiversity-climate', name: 'Biodiversità: Cambiamenti climatici', description: 'Impatti dei cambiamenti climatici sulla biodiversità' },
  { id: 'biodiversity-land-use', name: 'Biodiversità: Cambiamento di uso del suolo e dell\'acqua', description: 'Impatti del cambiamento di uso del suolo, dell\'acqua dolce e del mare sulla biodiversità' },
  { id: 'biodiversity-exploitation', name: 'Biodiversità: Sfruttamento diretto', description: 'Impatti dello sfruttamento diretto delle risorse naturali sulla biodiversità' },
  { id: 'biodiversity-invasive', name: 'Biodiversità: Specie esotiche invasive', description: 'Impatti delle specie esotiche invasive sugli ecosistemi locali' },
  { id: 'biodiversity-pollution', name: 'Biodiversità: Inquinamento', description: 'Impatti dell\'inquinamento sulla biodiversità' },
  { id: 'biodiversity-other', name: 'Biodiversità: Altri fattori di impatto', description: 'Altri fattori che impattano direttamente sulla biodiversità' },
  { id: 'species-population', name: 'Dimensioni della popolazione di una specie', description: 'Impatti sulle dimensioni delle popolazioni di specie' },
  { id: 'species-extinction', name: 'Rischio di estinzione globale di una specie', description: 'Contributo al rischio di estinzione globale di specie' },
  { id: 'soil-degradation', name: 'Degrado del suolo', description: 'Processi di degrado del suolo e misure di mitigazione' },
  { id: 'desertification', name: 'Desertificazione', description: 'Processi di desertificazione e misure di contrasto' },
  { id: 'soil-sealing', name: 'Impermeabilizzazione del suolo', description: 'Impatti dell\'impermeabilizzazione del suolo e misure di mitigazione' },
  { id: 'ecosystem-services', name: 'Servizi ecosistemici', description: 'Impatti e dipendenze in termini di servizi ecosistemici' },
  
  { id: 'resource-inflows', name: 'Afflussi di risorse', description: 'Gestione degli afflussi di risorse, compreso l\'uso efficiente delle risorse' },
  { id: 'resource-outflows', name: 'Deflussi di risorse', description: 'Gestione dei deflussi di risorse connessi a prodotti e servizi' },
  { id: 'waste', name: 'Rifiuti', description: 'Gestione dei rifiuti e strategie di riduzione' },
  
  { id: 'labor-secure', name: 'Occupazione sicura', description: 'Garantire condizioni di occupazione sicura e stabile per i lavoratori' },
  { id: 'labor-hours', name: 'Orario di lavoro', description: 'Gestione dell\'orario di lavoro e rispetto dei limiti previsti' },
  { id: 'labor-wages', name: 'Salari adeguati', description: 'Garantire salari adeguati e dignitosi ai lavoratori' },
  { id: 'labor-social-dialogue', name: 'Dialogo sociale', description: 'Promozione del dialogo tra lavoratori, rappresentanti e azienda' },
  { id: 'labor-association', name: 'Libertà di associazione e diritti di informazione', description: 'Garantire la libertà di associazione, l\'esistenza di comitati aziendali e i diritti di informazione, consultazione e partecipazione dei lavoratori' },
  { id: 'labor-collective', name: 'Contrattazione collettiva', description: 'Garantire il diritto alla contrattazione collettiva, inclusa la percentuale di lavoratori coperti da contratti collettivi' },
  { id: 'labor-work-life', name: 'Equilibrio tra vita professionale e vita privata', description: 'Politiche per favorire l\'equilibrio tra vita professionale e vita privata' },
  { id: 'labor-safety', name: 'Salute e sicurezza sul lavoro', description: 'Protezione della salute e sicurezza dei lavoratori' },
  { id: 'labor-gender', name: 'Parità di genere e retribuzione', description: 'Garantire la parità di genere e la parità di retribuzione per un lavoro di pari valore' },
  { id: 'labor-training', name: 'Formazione e sviluppo delle competenze', description: 'Investimenti nella formazione e nello sviluppo delle competenze dei lavoratori' },
  { id: 'labor-disability', name: 'Occupazione e inclusione delle persone con disabilità', description: 'Politiche per l\'inclusione lavorativa delle persone con disabilità' },
  { id: 'labor-harassment', name: 'Misure contro la violenza e le molestie', description: 'Misure contro la violenza e le molestie sul luogo di lavoro' },
  { id: 'labor-diversity', name: 'Diversità', description: 'Promozione della diversità nella forza lavoro' },
  { id: 'labor-child', name: 'Lavoro minorile', description: 'Prevenzione e contrasto del lavoro minorile' },
  { id: 'labor-forced', name: 'Lavoro forzato', description: 'Prevenzione e contrasto del lavoro forzato' },
  { id: 'labor-housing', name: 'Alloggi adeguati', description: 'Garantire alloggi adeguati ai lavoratori, ove applicabile' },
  { id: 'labor-privacy', name: 'Riservatezza', description: 'Tutela della riservatezza dei dati dei lavoratori' },
  
  { id: 'supply-labor-secure', name: 'Occupazione sicura nella catena del valore', description: 'Garantire condizioni di occupazione sicura per i lavoratori nella catena di fornitura' },
  { id: 'supply-labor-hours', name: 'Orario di lavoro nella catena del valore', description: 'Monitoraggio dell\'orario di lavoro nella catena di fornitura' },
  { id: 'supply-labor-wages', name: 'Salari adeguati nella catena del valore', description: 'Garantire salari adeguati ai lavoratori nella catena di fornitura' },
  { id: 'supply-labor-dialogue', name: 'Dialogo sociale nella catena del valore', description: 'Promozione del dialogo sociale nella catena di fornitura' },
  { id: 'supply-labor-association', name: 'Libertà di associazione nella catena del valore', description: 'Garantire la libertà di associazione, compresa l\'esistenza di comitati aziendali nella catena di fornitura' },
  { id: 'supply-labor-collective', name: 'Contrattazione collettiva nella catena del valore', description: 'Rispetto della contrattazione collettiva nella catena di fornitura' },
  { id: 'supply-labor-work-life', name: 'Equilibrio vita-lavoro nella catena del valore', description: 'Equilibrio tra vita professionale e vita privata nella catena di fornitura' },
  { id: 'supply-labor-safety', name: 'Salute e sicurezza nella catena del valore', description: 'Salute e sicurezza dei lavoratori nella catena di fornitura' },
  { id: 'supply-labor-gender', name: 'Parità di genere nella catena del valore', description: 'Parità di genere e di retribuzione nella catena di fornitura' },
  { id: 'supply-labor-training', name: 'Formazione nella catena del valore', description: 'Formazione e sviluppo delle competenze nella catena di fornitura' },
  { id: 'supply-labor-disability', name: 'Inclusione disabilità nella catena del valore', description: 'Occupazione e inclusione delle persone con disabilità nella catena di fornitura' },
  { id: 'supply-labor-harassment', name: 'Anti-molestie nella catena del valore', description: 'Misure contro la violenza e le molestie sul luogo di lavoro nella catena di fornitura' },
  { id: 'supply-labor-diversity', name: 'Diversità nella catena del valore', description: 'Promozione della diversità nella catena di fornitura' },
  { id: 'supply-labor-child', name: 'Lavoro minorile nella catena del valore', description: 'Prevenzione del lavoro minorile nella catena di fornitura' },
  { id: 'supply-labor-forced', name: 'Lavoro forzato nella catena del valore', description: 'Prevenzione del lavoro forzato nella catena di fornitura' },
  { id: 'supply-labor-housing', name: 'Alloggi nella catena del valore', description: 'Alloggi adeguati nella catena di fornitura' },
  { id: 'supply-water-sanitation', name: 'Acqua e servizi igienico-sanitari', description: 'Accesso all\'acqua e ai servizi igienico-sanitari nella catena di fornitura' },
  { id: 'supply-labor-privacy', name: 'Riservatezza nella catena del valore', description: 'Tutela della riservatezza nella catena di fornitura' },
  
  { id: 'community-housing', name: 'Alloggi adeguati per le comunità', description: 'Garantire alloggi adeguati per le comunità locali' },
  { id: 'community-food', name: 'Alimentazione adeguata', description: 'Garantire alimentazione adeguata per le comunità locali' },
  { id: 'community-water', name: 'Acqua e servizi igienico-sanitari per le comunità', description: 'Garantire accesso ad acqua e servizi igienico-sanitari per le comunità locali' },
  { id: 'community-land', name: 'Impatti legati al territorio', description: 'Gestione degli impatti legati al territorio sulle comunità locali' },
  { id: 'community-security', name: 'Impatti legati alla sicurezza', description: 'Gestione degli impatti legati alla sicurezza sulle comunità locali' },
  { id: 'community-expression', name: 'Libertà di espressione', description: 'Rispetto della libertà di espressione delle comunità' },
  { id: 'community-association', name: 'Libertà di associazione delle comunità', description: 'Rispetto della libertà di associazione delle comunità' },
  { id: 'community-rights-defenders', name: 'Impatto sui difensori dei diritti umani', description: 'Gestione dell\'impatto sui difensori dei diritti umani' },
  { id: 'indigenous-consent', name: 'Consenso libero, previo e informato', description: 'Rispetto del consenso libero, previo e informato dei popoli indigeni' },
  { id: 'indigenous-determination', name: 'Autodeterminazione', description: 'Rispetto dell\'autodeterminazione dei popoli indigeni' },
  { id: 'indigenous-cultural', name: 'Diritti culturali dei popoli indigeni', description: 'Rispetto dei diritti culturali dei popoli indigeni' },
  
  { id: 'consumer-privacy', name: 'Riservatezza dei consumatori', description: 'Tutela della riservatezza dei dati dei consumatori' },
  { id: 'consumer-expression', name: 'Libertà di espressione dei consumatori', description: 'Rispetto della libertà di espressione dei consumatori' },
  { id: 'consumer-information', name: 'Accesso a informazioni di qualità', description: 'Garantire ai consumatori l\'accesso a informazioni di qualità' },
  { id: 'consumer-health-safety', name: 'Salute e sicurezza dei consumatori', description: 'Tutela della salute e sicurezza dei consumatori' },
  { id: 'consumer-security', name: 'Sicurezza della persona', description: 'Tutela della sicurezza personale dei consumatori' },
  { id: 'consumer-child-protection', name: 'Protezione dei bambini', description: 'Misure per la protezione dei bambini consumatori' },
  { id: 'consumer-non-discrimination', name: 'Non discriminazione dei consumatori', description: 'Prevenzione della discriminazione nei confronti dei consumatori' },
  { id: 'consumer-access', name: 'Accesso a prodotti e servizi', description: 'Garantire l\'accesso equo a prodotti e servizi' },
  { id: 'consumer-practices', name: 'Pratiche commerciali responsabili', description: 'Adozione di pratiche commerciali responsabili verso i consumatori' },
  
  { id: 'business-culture', name: 'Cultura d\'impresa', description: 'Promozione di una cultura d\'impresa etica e responsabile' },
  { id: 'whistleblower-protection', name: 'Protezione degli informatori', description: 'Misure per la protezione degli informatori (whistleblower)' },
  { id: 'animal-welfare', name: 'Benessere degli animali', description: 'Protezione del benessere degli animali' },
  { id: 'political-engagement', name: 'Impegno politico e attività di lobbying', description: 'Gestione responsabile dell\'impegno politico e delle attività di lobbying' },
  { id: 'supplier-relations', name: 'Gestione dei rapporti con i fornitori', description: 'Gestione dei rapporti con i fornitori, comprese le prassi di pagamento' },
  { id: 'corruption-prevention', name: 'Prevenzione della corruzione', description: 'Prevenzione e individuazione della corruzione, compresa la formazione' },
  { id: 'corruption-incidents', name: 'Incidenti di corruzione', description: 'Gestione degli incidenti di corruzione' }
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
