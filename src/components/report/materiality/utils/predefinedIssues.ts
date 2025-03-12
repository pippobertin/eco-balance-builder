
import { MaterialityIssue } from '../types';

const createBasicIssue = (id: string, name: string, description: string): MaterialityIssue => ({
  id,
  name,
  description,
  impactRelevance: 50,
  financialRelevance: 50,
  isMaterial: true
});

// Crea i temi principali che fungono da titoli
const createHeaderTheme = (id: string, name: string): MaterialityIssue => ({
  id,
  name,
  description: '',
  impactRelevance: 0,
  financialRelevance: 0,
  isMaterial: false
});

export const predefinedIssues: MaterialityIssue[] = [
  // TITOLI PRINCIPALI
  createHeaderTheme('climate-change-header', 'Cambiamenti climatici'),
  createHeaderTheme('pollution-header', 'Inquinamento'),
  createHeaderTheme('water-marine-header', 'Acque e risorse marine'),
  createHeaderTheme('biodiversity-header', 'Biodiversità ed ecosistemi'),
  createHeaderTheme('circular-economy-header', 'Economia circolare'),
  
  // TITOLI SOCIALI
  createHeaderTheme('own-workforce-header', 'Forza lavoro propria'),
  createHeaderTheme('value-chain-workers-header', 'Lavoratori nella catena del valore'),
  createHeaderTheme('affected-communities-header', 'Comunità interessate'),
  createHeaderTheme('consumers-end-users-header', 'Consumatori e utilizzatori finali'),
  
  // TITOLO GOVERNANCE
  createHeaderTheme('business-conduct-header', 'Condotta delle imprese'),

  // Temi selezionabili
  // AMBIENTE - Cambiamenti climatici
  createBasicIssue('climate-adaptation', 'Adattamento ai cambiamenti climatici', 'Misure per adattarsi agli effetti dei cambiamenti climatici'),
  createBasicIssue('climate-mitigation', 'Mitigazione dei cambiamenti climatici', 'Riduzione delle emissioni e altre azioni per mitigare i cambiamenti climatici'),
  createBasicIssue('energy-management', 'Energia', 'Gestione dell\'energia e transizione alle energie rinnovabili'),
  
  // AMBIENTE - Inquinamento
  createBasicIssue('pollution-air', 'Inquinamento dell\'aria', 'Gestione e riduzione dell\'inquinamento atmosferico'),
  createBasicIssue('pollution-water', 'Inquinamento dell\'acqua', 'Gestione e prevenzione dell\'inquinamento idrico'),
  createBasicIssue('pollution-soil', 'Inquinamento del suolo', 'Prevenzione e gestione dell\'inquinamento del suolo'),
  createBasicIssue('pollution-living', 'Inquinamento di organismi viventi e risorse alimentari', 'Gestione dell\'inquinamento con impatto sugli organismi viventi e sulla catena alimentare'),
  createBasicIssue('substances-concern', 'Sostanze preoccupanti', 'Gestione delle sostanze che destano preoccupazione'),
  createBasicIssue('substances-extreme-concern', 'Sostanze estremamente preoccupanti', 'Gestione delle sostanze che destano estrema preoccupazione'),
  
  // AMBIENTE - Acque e risorse marine
  createBasicIssue('water-management', 'Acque', 'Gestione sostenibile delle risorse idriche'),
  createBasicIssue('marine-resources', 'Risorse marine', 'Gestione sostenibile delle risorse marine'),
  createBasicIssue('water-consumption', 'Consumo idrico', 'Riduzione e ottimizzazione del consumo di acqua'),
  createBasicIssue('water-withdrawal', 'Prelievi idrici', 'Gestione sostenibile dei prelievi d\'acqua'),
  createBasicIssue('water-discharge', 'Scarichi di acque', 'Gestione degli scarichi idrici'),
  createBasicIssue('ocean-discharge', 'Scarichi di acque negli oceani', 'Gestione degli scarichi idrici negli oceani'),
  createBasicIssue('marine-extraction', 'Estrazione e uso di risorse marine', 'Gestione sostenibile dell\'estrazione e dell\'uso di risorse marine'),
  
  // AMBIENTE - Biodiversità ed ecosistemi
  createBasicIssue('biodiversity-climate', 'Cambiamenti climatici', 'Impatto dei cambiamenti climatici sulla biodiversità'),
  createBasicIssue('biodiversity-land-use', 'Cambiamento di uso del suolo, dell\'acqua dolce e del mare', 'Impatto dei cambiamenti di uso del territorio sulla biodiversità'),
  createBasicIssue('biodiversity-exploitation', 'Sfruttamento diretto', 'Impatto dello sfruttamento diretto sulla biodiversità'),
  createBasicIssue('biodiversity-species', 'Specie esotiche invasive', 'Gestione delle specie esotiche invasive'),
  createBasicIssue('biodiversity-pollution', 'Inquinamento', 'Impatto dell\'inquinamento sulla biodiversità'),
  createBasicIssue('biodiversity-other', 'Altro', 'Altri fattori di impatto sulla biodiversità'),
  
  createBasicIssue('species-population', 'Dimensioni della popolazione di una specie', 'Impatto sulle dimensioni della popolazione di una specie'),
  createBasicIssue('species-extinction', 'Rischio di estinzione globale di una specie', 'Contributo al rischio di estinzione di una specie'),
  
  createBasicIssue('ecosystem-soil', 'Degrado del suolo', 'Impatti sul degrado del suolo'),
  createBasicIssue('ecosystem-desertification', 'Desertificazione', 'Contributo alla desertificazione'),
  createBasicIssue('ecosystem-impermeability', 'Impermeabilizzazione del suolo', 'Impatti legati all\'impermeabilizzazione del suolo'),
  
  createBasicIssue('ecosystem-services', 'Impatti e dipendenze in termini di servizi ecosistemici', 'Gestione degli impatti e delle dipendenze dai servizi ecosistemici'),
  
  // AMBIENTE - Economia circolare
  createBasicIssue('circular-resources', 'Afflussi di risorse', 'Gestione degli afflussi di risorse, compreso l\'uso delle risorse'),
  createBasicIssue('circular-products', 'Deflussi di risorse connessi a prodotti e servizi', 'Gestione dei deflussi di risorse legati a prodotti e servizi'),
  createBasicIssue('circular-waste', 'Rifiuti', 'Gestione e riduzione dei rifiuti'),
  
  // SOCIALE - Forza lavoro propria
  createBasicIssue('workforce-conditions', 'Condizioni di lavoro', 'Promozione di adeguate condizioni di lavoro per i dipendenti'),
  createBasicIssue('workforce-security', 'Occupazione sicura', 'Garanzia di un\'occupazione stabile e sicura'),
  createBasicIssue('workforce-hours', 'Orario di lavoro', 'Gestione dell\'orario di lavoro'),
  createBasicIssue('workforce-wages', 'Salari adeguati', 'Garanzia di salari adeguati'),
  createBasicIssue('workforce-dialogue', 'Dialogo sociale', 'Promozione del dialogo sociale in azienda'),
  createBasicIssue('workforce-association', 'Libertà di associazione', 'Rispetto della libertà di associazione e dei diritti di rappresentanza'),
  createBasicIssue('workforce-bargaining', 'Contrattazione collettiva', 'Gestione della contrattazione collettiva'),
  createBasicIssue('workforce-balance', 'Equilibrio vita-lavoro', 'Promozione dell\'equilibrio tra vita professionale e vita privata'),
  createBasicIssue('workforce-health', 'Salute e sicurezza', 'Tutela della salute e della sicurezza sul lavoro'),
  
  createBasicIssue('workforce-equality', 'Parità di trattamento e di opportunità', 'Promozione della parità di trattamento e di opportunità'),
  createBasicIssue('workforce-gender', 'Parità di genere', 'Promozione della parità di genere e di retribuzione per lavoro di pari valore'),
  createBasicIssue('workforce-training', 'Formazione e sviluppo delle competenze', 'Promozione della formazione e dello sviluppo delle competenze'),
  createBasicIssue('workforce-disability', 'Inclusione delle persone con disabilità', 'Promozione dell\'occupazione e dell\'inclusione delle persone con disabilità'),
  createBasicIssue('workforce-harassment', 'Misure contro molestie sul lavoro', 'Misure contro la violenza e le molestie sul luogo di lavoro'),
  createBasicIssue('workforce-diversity', 'Diversità', 'Gestione e promozione della diversità'),
  
  createBasicIssue('workforce-child-labor', 'Lavoro minorile', 'Prevenzione del lavoro minorile'),
  createBasicIssue('workforce-forced-labor', 'Lavoro forzato', 'Prevenzione del lavoro forzato'),
  createBasicIssue('workforce-housing', 'Alloggi adeguati', 'Garanzia di alloggi adeguati'),
  createBasicIssue('workforce-privacy', 'Riservatezza', 'Tutela della riservatezza dei dipendenti'),
  
  // SOCIALE - Lavoratori nella catena del valore
  createBasicIssue('labor-conditions', 'Condizioni di lavoro nella catena del valore', 'Promozione di adeguate condizioni di lavoro nella catena del valore'),
  createBasicIssue('labor-security', 'Occupazione sicura', 'Promozione dell\'occupazione sicura nella catena del valore'),
  createBasicIssue('labor-hours', 'Orario di lavoro', 'Monitoraggio dell\'orario di lavoro nella catena del valore'),
  createBasicIssue('labor-wages', 'Salari adeguati', 'Promozione di salari adeguati nella catena del valore'),
  createBasicIssue('labor-dialogue', 'Dialogo sociale', 'Promozione del dialogo sociale nella catena del valore'),
  createBasicIssue('labor-association', 'Libertà di associazione', 'Rispetto della libertà di associazione nella catena del valore'),
  createBasicIssue('labor-bargaining', 'Contrattazione collettiva', 'Rispetto della contrattazione collettiva nella catena del valore'),
  createBasicIssue('labor-balance', 'Equilibrio vita-lavoro', 'Promozione dell\'equilibrio tra vita professionale e privata nella catena del valore'),
  createBasicIssue('labor-health', 'Salute e sicurezza', 'Tutela della salute e sicurezza nella catena del valore'),
  
  createBasicIssue('labor-equality', 'Parità di trattamento nella catena del valore', 'Promozione della parità di trattamento e opportunità nella catena del valore'),
  createBasicIssue('labor-gender', 'Parità di genere', 'Promozione della parità di genere nella catena del valore'),
  createBasicIssue('labor-training', 'Formazione nella catena del valore', 'Promozione della formazione nella catena del valore'),
  createBasicIssue('labor-disability', 'Inclusione delle persone con disabilità', 'Promozione dell\'inclusione delle persone con disabilità nella catena del valore'),
  createBasicIssue('labor-harassment', 'Misure contro molestie', 'Misure contro violenza e molestie nella catena del valore'),
  createBasicIssue('labor-diversity', 'Diversità', 'Promozione della diversità nella catena del valore'),
  
  createBasicIssue('labor-child-labor', 'Lavoro minorile', 'Prevenzione del lavoro minorile nella catena del valore'),
  createBasicIssue('labor-forced-labor', 'Lavoro forzato', 'Prevenzione del lavoro forzato nella catena del valore'),
  createBasicIssue('labor-housing', 'Alloggi adeguati', 'Garanzia di alloggi adeguati nella catena del valore'),
  createBasicIssue('labor-water', 'Acqua e servizi igienico-sanitari', 'Accesso ad acqua e servizi igienico-sanitari nella catena del valore'),
  createBasicIssue('labor-privacy', 'Riservatezza', 'Tutela della riservatezza nella catena del valore'),
  
  // SOCIALE - Comunità interessate
  createBasicIssue('community-economic', 'Diritti economici, sociali e culturali', 'Rispetto dei diritti economici, sociali e culturali delle comunità interessate'),
  createBasicIssue('community-housing', 'Alloggi adeguati', 'Rispetto del diritto ad alloggi adeguati per le comunità interessate'),
  createBasicIssue('community-food', 'Alimentazione adeguata', 'Rispetto del diritto all\'alimentazione adeguata per le comunità interessate'),
  createBasicIssue('community-water', 'Acqua e servizi igienico-sanitari', 'Rispetto del diritto all\'acqua e ai servizi igienico-sanitari per le comunità interessate'),
  createBasicIssue('community-land', 'Impatti legati al territorio', 'Gestione degli impatti legati al territorio per le comunità interessate'),
  createBasicIssue('community-security', 'Impatti legati alla sicurezza', 'Gestione degli impatti sulla sicurezza delle comunità interessate'),
  
  createBasicIssue('community-civil', 'Diritti civili e politici', 'Rispetto dei diritti civili e politici delle comunità interessate'),
  createBasicIssue('community-expression', 'Libertà di espressione', 'Rispetto della libertà di espressione nelle comunità interessate'),
  createBasicIssue('community-association', 'Libertà di associazione', 'Rispetto della libertà di associazione nelle comunità interessate'),
  createBasicIssue('community-defenders', 'Impatto sui difensori dei diritti umani', 'Gestione dell\'impatto sui difensori dei diritti umani'),
  
  createBasicIssue('indigenous-rights', 'Diritti dei popoli indigeni', 'Rispetto dei diritti dei popoli indigeni'),
  createBasicIssue('indigenous-consent', 'Consenso libero, previo e informato', 'Rispetto del consenso libero, previo e informato dei popoli indigeni'),
  createBasicIssue('indigenous-determination', 'Autodeterminazione', 'Rispetto dell\'autodeterminazione dei popoli indigeni'),
  createBasicIssue('indigenous-culture', 'Diritti culturali', 'Rispetto dei diritti culturali dei popoli indigeni'),
  
  // SOCIALE - Consumatori e utilizzatori finali
  createBasicIssue('consumer-information', 'Impatti legati alle informazioni per i consumatori', 'Gestione degli impatti legati alle informazioni fornite ai consumatori'),
  createBasicIssue('consumer-privacy', 'Riservatezza', 'Tutela della riservatezza dei consumatori'),
  createBasicIssue('consumer-expression', 'Libertà di espressione', 'Rispetto della libertà di espressione dei consumatori'),
  createBasicIssue('consumer-access', 'Accesso a informazioni di qualità', 'Garanzia dell\'accesso a informazioni di qualità per i consumatori'),
  
  createBasicIssue('consumer-safety', 'Sicurezza personale dei consumatori', 'Tutela della sicurezza personale dei consumatori o degli utilizzatori finali'),
  createBasicIssue('consumer-health', 'Salute e sicurezza', 'Tutela della salute e sicurezza dei consumatori'),
  createBasicIssue('consumer-personal', 'Sicurezza della persona', 'Tutela della sicurezza della persona per i consumatori'),
  createBasicIssue('consumer-children', 'Protezione dei bambini', 'Misure per la protezione dei bambini'),
  
  createBasicIssue('consumer-inclusion', 'Inclusione sociale dei consumatori', 'Promozione dell\'inclusione sociale dei consumatori o degli utilizzatori finali'),
  createBasicIssue('consumer-nondiscrimination', 'Non discriminazione', 'Garanzia della non discriminazione dei consumatori'),
  createBasicIssue('consumer-access-services', 'Accesso a prodotti e servizi', 'Promozione dell\'accesso ai prodotti e servizi'),
  createBasicIssue('consumer-practices', 'Pratiche commerciali responsabili', 'Adozione di pratiche commerciali responsabili verso i consumatori'),
  
  // GOVERNANCE - Condotta delle imprese
  createBasicIssue('business-culture', 'Cultura d\'impresa', 'Sviluppo e promozione di una cultura d\'impresa etica e responsabile'),
  createBasicIssue('whistleblower-protection', 'Protezione degli informatori', 'Misure per la protezione degli informatori (whistleblower)'),
  createBasicIssue('animal-welfare', 'Benessere degli animali', 'Misure per garantire il benessere degli animali'),
  createBasicIssue('political-engagement', 'Impegno politico e attività di lobbying', 'Gestione trasparente dell\'impegno politico e delle attività di lobbying'),
  createBasicIssue('supplier-management', 'Gestione dei rapporti con i fornitori', 'Gestione sostenibile dei rapporti con i fornitori, comprese le prassi di pagamento'),
  
  createBasicIssue('corruption-prevention', 'Prevenzione e individuazione della corruzione', 'Misure per la prevenzione e l\'individuazione della corruzione, compresa la formazione'),
  createBasicIssue('corruption-incidents', 'Incidenti di corruzione', 'Gestione degli incidenti di corruzione')
];
