import { Stakeholder, MaterialityIssue, IROData } from '../types';

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
  };
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

// Nuovo oggetto per IRO (Impatti, Rischi, Opportunità) predefiniti associati a ciascun tema materiale
export const predefinedIROData: Record<string, IROData> = {
  // Cambiamenti climatici
  'climate-adaptation': {
    impacts: [
      'Aumento della resilienza delle operazioni aziendali ai cambiamenti climatici',
      'Riduzione della vulnerabilità della catena di approvvigionamento agli eventi meteorologici estremi',
      'Miglioramento della capacità di adattamento dei prodotti e servizi offerti',
      'Diminuzione dell\'impatto negativo sulle comunità locali'
    ],
    risks: [
      'Interruzione delle operazioni a causa di eventi meteorologici estremi',
      'Aumento dei costi assicurativi legati ai rischi climatici',
      'Obsolescenza prematura di impianti e infrastrutture non adattati',
      'Rischi reputazionali derivanti dall\'inadeguata gestione degli impatti climatici'
    ],
    opportunities: [
      'Sviluppo di nuovi prodotti e servizi resilienti ai cambiamenti climatici',
      'Accesso a nuovi mercati in risposta a mutate condizioni climatiche',
      'Posizionamento come leader nel settore dell\'adattamento climatico',
      'Riduzione dei costi operativi grazie a misure di adattamento preventive'
    ],
    actions: [
      'Implementare un piano di adattamento climatico aziendale',
      'Effettuare valutazioni di vulnerabilità climatica per siti operativi chiave',
      'Diversificare la catena di approvvigionamento per ridurre i rischi legati al clima',
      'Investire in infrastrutture resilienti ai cambiamenti climatici'
    ]
  },
  'climate-mitigation': {
    impacts: [
      'Riduzione dell\'impronta di carbonio aziendale',
      'Diminuzione delle emissioni indirette lungo la catena del valore',
      'Contributo positivo agli obiettivi climatici nazionali e internazionali',
      'Riduzione dell\'impatto ambientale complessivo delle operazioni'
    ],
    risks: [
      'Aumento dei costi legati all\'adeguamento normativo',
      'Rischi di transizione verso un\'economia a basse emissioni di carbonio',
      'Perdita di competitività rispetto a concorrenti con minori emissioni',
      'Esposizione a tasse sul carbonio e sistemi di cap-and-trade'
    ],
    opportunities: [
      'Riduzione dei costi energetici attraverso l\'efficienza',
      'Accesso a incentivi e finanziamenti per progetti a basse emissioni',
      'Miglioramento dell\'immagine aziendale come leader sostenibile',
      'Sviluppo di prodotti e servizi a basse emissioni di carbonio'
    ],
    actions: [
      'Stabilire obiettivi di riduzione delle emissioni basati sulla scienza',
      'Implementare un piano d\'azione per il clima con target a breve e lungo termine',
      'Investire in energia rinnovabile e tecnologie a basse emissioni',
      'Ottimizzare processi e operazioni per ridurre il consumo energetico'
    ]
  },
  'energy': {
    impacts: [
      'Riduzione del consumo energetico complessivo',
      'Diminuzione delle emissioni di gas serra associate all\'energia',
      'Minore dipendenza da fonti energetiche non rinnovabili',
      'Miglioramento dell\'efficienza energetica delle operazioni'
    ],
    risks: [
      'Volatilità dei prezzi dell\'energia',
      'Interruzioni nella fornitura energetica',
      'Mancato adeguamento alle normative sull\'efficienza energetica',
      'Costi elevati per la transizione verso fonti energetiche alternative'
    ],
    opportunities: [
      'Riduzione significativa dei costi operativi',
      'Generazione di energia in loco da fonti rinnovabili',
      'Miglioramento dell\'immagine aziendale come organizzazione efficiente',
      'Sviluppo di competenze e tecnologie per l\'efficienza energetica'
    ],
    actions: [
      'Condurre audit energetici periodici',
      'Implementare un sistema di gestione dell\'energia (ISO 50001)',
      'Investire in tecnologie di efficienza energetica',
      'Passare a fonti di energia rinnovabile per le operazioni aziendali'
    ]
  },
  
  // Inquinamento
  'pollution-air': {
    impacts: [
      'Riduzione delle emissioni di inquinanti atmosferici',
      'Miglioramento della qualità dell\'aria nelle aree operative',
      'Diminuzione degli impatti sulla salute delle comunità locali',
      'Riduzione dell\'impatto sui cambiamenti climatici'
    ],
    risks: [
      'Sanzioni normative per superamento dei limiti di emissione',
      'Azioni legali da parte delle comunità colpite',
      'Costi operativi elevati per il controllo dell\'inquinamento',
      'Rischi reputazionali legati all\'inquinamento atmosferico'
    ],
    opportunities: [
      'Implementazione di tecnologie innovative di abbattimento',
      'Risparmio nei costi attraverso processi più efficienti',
      'Miglioramento delle relazioni con le comunità locali',
      'Accesso a mercati con rigorosi standard ambientali'
    ],
    actions: [
      'Monitorare e riportare regolarmente le emissioni atmosferiche',
      'Investire in tecnologie di abbattimento degli inquinanti',
      'Ottimizzare i processi per ridurre le emissioni alla fonte',
      'Implementare piani di manutenzione preventiva per evitare emissioni fugitive'
    ]
  },
  'pollution-water': {
    impacts: [
      'Riduzione degli scarichi inquinanti nei corpi idrici',
      'Preservazione della qualità delle acque superficiali e sotterranee',
      'Protezione degli ecosistemi acquatici',
      'Diminuzione dell\'impatto sulla biodiversità acquatica'
    ],
    risks: [
      'Sanzioni per violazioni dei limiti di scarico',
      'Aumento dei costi di trattamento delle acque reflue',
      'Contaminazione delle falde acquifere e responsabilità legali',
      'Danno all\'immagine aziendale per incidenti di inquinamento idrico'
    ],
    opportunities: [
      'Riutilizzo e riciclo delle acque reflue',
      'Innovazione nei processi di trattamento delle acque',
      'Riduzione dei costi attraverso il recupero di materiali dagli effluenti',
      'Miglioramento delle relazioni con stakeholder e comunità locali'
    ],
    actions: [
      'Implementare sistemi avanzati di trattamento delle acque reflue',
      'Monitorare costantemente la qualità degli scarichi idrici',
      'Sviluppare processi a ciclo chiuso per ridurre gli scarichi',
      'Formare il personale sulle migliori pratiche di gestione delle acque'
    ]
  },
  'pollution-soil': {
    impacts: [
      'Prevenzione della contaminazione del suolo da sostanze pericolose',
      'Preservazione della qualità e fertilità del terreno',
      'Protezione degli ecosistemi terrestri',
      'Miglioramento della sicurezza alimentare nelle aree agricole'
    ],
    risks: [
      'Responsabilità legali per la bonifica dei siti contaminati',
      'Costi elevati per il ripristino ambientale',
      'Restrizioni all\'uso futuro dei terreni contaminati',
      'Impatti negativi sulla salute della comunità e contenziosi correlati'
    ],
    opportunities: [
      'Sviluppo di tecnologie innovative di bonifica',
      'Valorizzazione di terreni precedentemente contaminati',
      'Miglioramento dei processi per prevenire sversamenti e perdite',
      'Rafforzamento della reputazione attraverso la gestione responsabile del suolo'
    ],
    actions: [
      'Condurre valutazioni periodiche della contaminazione del suolo',
      'Implementare misure preventive contro sversamenti e perdite',
      'Sviluppare piani di risposta alle emergenze per incidenti di contaminazione',
      'Investire in tecnologie di bonifica sostenibili'
    ]
  },
  'pollution-organisms': {
    impacts: [
      'Riduzione della bioaccumulazione di inquinanti negli organismi viventi',
      'Diminuzione dell\'impatto sulla catena alimentare',
      'Protezione della sicurezza alimentare',
      'Preservazione della biodiversità e degli ecosistemi'
    ],
    risks: [
      'Responsabilità legali per danni alla salute umana',
      'Restrizioni alla commercializzazione di prodotti contaminati',
      'Danni reputazionali significativi',
      'Rischi normativi crescenti legati alla contaminazione alimentare'
    ],
    opportunities: [
      'Sviluppo di processi produttivi più sicuri',
      'Creazione di prodotti alimentari certificati "puliti"',
      'Accesso a mercati premium per prodotti non contaminati',
      'Innovazione nelle tecniche di monitoraggio della contaminazione'
    ],
    actions: [
      'Implementare un sistema di tracciabilità dei contaminanti',
      'Monitorare regolarmente la presenza di inquinanti nei prodotti',
      'Adottare principi di produzione pulita e sicura',
      'Collaborare con le autorità sanitarie e gli esperti del settore'
    ]
  },
  
  // Risorse idriche
  'water-consumption': {
    impacts: [
      'Riduzione del prelievo idrico totale dell\'organizzazione',
      'Diminuzione della pressione sulle risorse idriche locali',
      'Miglioramento dell\'accessibilità all\'acqua per le comunità locali',
      'Preservazione degli ecosistemi acquatici'
    ],
    risks: [
      'Limitazioni all\'accesso alle risorse idriche',
      'Aumento dei costi dell\'acqua',
      'Conflitti con le comunità locali per l\'uso dell\'acqua',
      'Interruzioni operative dovute a scarsità idrica'
    ],
    opportunities: [
      'Riduzione dei costi operativi attraverso l\'efficienza idrica',
      'Miglioramento dei processi con tecnologie a ridotto consumo d\'acqua',
      'Innovazione di prodotti water-saving',
      'Rafforzamento della reputazione come azienda responsabile'
    ],
    actions: [
      'Implementare tecnologie di risparmio idrico',
      'Monitorare e misurare regolarmente i consumi d\'acqua',
      'Fissare obiettivi di riduzione del consumo idrico',
      'Educare dipendenti e fornitori sull\'importanza dell\'efficienza idrica'
    ]
  },
  'water-withdrawal': {
    impacts: [
      'Riduzione dell\'impatto sulle fonti idriche locali',
      'Diminuzione della pressione su bacini idrici vulnerabili',
      'Preservazione del flusso naturale dei corsi d\'acqua',
      'Mantenimento della disponibilità idrica per altri utenti'
    ],
    risks: [
      'Restrizioni normative sui prelievi idrici',
      'Aumento delle tasse e tariffe idriche',
      'Opposizione delle comunità ai prelievi aziendali',
      'Vulnerabilità operativa in periodi di siccità'
    ],
    opportunities: [
      'Diversificazione delle fonti di approvvigionamento idrico',
      'Utilizzo di acqua riciclata o di processo',
      'Implementazione di sistemi di raccolta dell\'acqua piovana',
      'Sviluppo di tecnologie innovative di raccolta e trattamento'
    ],
    actions: [
      'Condurre valutazioni di impatto sui bacini idrici',
      'Mappare le fonti di prelievo e valutarne la sostenibilità',
      'Implementare contatori e sistemi di monitoraggio dei prelievi',
      'Sviluppare piani di contingenza per periodi di scarsità idrica'
    ]
  },
  'water-discharge': {
    impacts: [
      'Riduzione degli impatti negativi sugli ecosistemi acquatici',
      'Miglioramento della qualità delle acque riceventi',
      'Diminuzione degli inquinanti rilasciati nell\'ambiente',
      'Preservazione della biodiversità acquatica'
    ],
    risks: [
      'Sanzioni per il superamento dei limiti di scarico',
      'Costi di conformità a normative sempre più stringenti',
      'Responsabilità legali per danni ambientali',
      'Opposizione delle comunità agli scarichi aziendali'
    ],
    opportunities: [
      'Recupero e riutilizzo delle acque reflue',
      'Estrazione di risorse valorizzabili dagli effluenti',
      'Innovazione nei processi di trattamento delle acque',
      'Miglioramento dell\'immagine aziendale come gestore responsabile'
    ],
    actions: [
      'Implementare tecnologie avanzate di trattamento delle acque reflue',
      'Monitorare continuamente la qualità degli scarichi',
      'Sviluppare sistemi di riutilizzo delle acque trattate',
      'Collaborare con le autorità di bacino per la gestione integrata'
    ]
  },
  
  // Biodiversità
  'biodiversity-climate': {
    impacts: [
      'Riduzione dell\'impatto dei cambiamenti climatici sulla biodiversità locale',
      'Preservazione degli habitat naturali vulnerabili agli eventi climatici',
      'Protezione delle specie minacciate dai cambiamenti climatici',
      'Mantenimento dei servizi ecosistemici in un clima che cambia'
    ],
    risks: [
      'Perdita di biodiversità nelle aree operative',
      'Alterazione degli ecosistemi che supportano le attività aziendali',
      'Rischi reputazionali legati alla perdita di specie emblematiche',
      'Diminuzione dei servizi ecosistemici essenziali'
    ],
    opportunities: [
      'Sviluppo di soluzioni basate sulla natura per l\'adattamento climatico',
      'Creazione di valore attraverso la protezione e il ripristino degli ecosistemi',
      'Accesso a mercati sensibili alla conservazione della biodiversità',
      'Innovazione di prodotti e servizi climate-resilient'
    ],
    actions: [
      'Integrare valutazioni di biodiversità nei piani di adattamento climatico',
      'Implementare progetti di conservazione degli habitat vulnerabili',
      'Sviluppare corridoi ecologici che facilitino la migrazione delle specie',
      'Monitorare gli impatti dei cambiamenti climatici sulla biodiversità locale'
    ]
  },
  'biodiversity-land-use': {
    impacts: [
      'Riduzione della frammentazione degli habitat naturali',
      'Preservazione di aree ad alto valore di biodiversità',
      'Minimizzazione dell\'impatto sugli ecosistemi sensibili',
      'Mantenimento della connettività ecologica'
    ],
    risks: [
      'Restrizioni all\'uso del suolo in aree di elevato valore ecologico',
      'Opposizione delle comunità e degli stakeholder ambientali',
      'Costi di compensazione e ripristino ambientale',
      'Limitazioni allo sviluppo futuro di siti produttivi'
    ],
    opportunities: [
      'Valorizzazione dei terreni attraverso la gestione sostenibile',
      'Miglioramento delle relazioni con le comunità locali',
      'Accesso a certificazioni e mercati premium',
      'Sviluppo di approcci innovativi all\'uso del suolo'
    ],
    actions: [
      'Implementare la gerarchia di mitigazione per i nuovi sviluppi',
      'Condurre valutazioni d\'impatto sulla biodiversità',
      'Sviluppare piani di gestione della biodiversità per i siti operativi',
      'Implementare programmi di ripristino ecologico'
    ]
  },
  
  // Economia circolare
  'resource-inflows': {
    impacts: [
      'Riduzione dell\'utilizzo di materie prime vergini',
      'Diminuzione dell\'impronta ecologica dei prodotti',
      'Riduzione degli impatti ambientali dell\'estrazione di risorse',
      'Preservazione delle risorse naturali non rinnovabili'
    ],
    risks: [
      'Volatilità dei prezzi delle materie prime',
      'Interruzioni nella catena di approvvigionamento',
      'Dipendenza da risorse
