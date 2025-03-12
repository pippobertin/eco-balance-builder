
import { MaterialityIssue } from '../types';

// Funzione di supporto per creare oggetti di issue con valori predefiniti
const createBasicIssue = (id: string, name: string, description: string): MaterialityIssue => ({
  id,
  name,
  description,
  impactRelevance: 50,
  financialRelevance: 50,
  isMaterial: true
});

// Predefined issues for the application
export const predefinedIssues: MaterialityIssue[] = [
  // Environmental Issues
  createBasicIssue('env-climate', 'Cambiamento climatico', 'Mitigazione e adattamento ai cambiamenti climatici'),
  createBasicIssue('env-energy', 'Energia', 'Gestione dell\'energia e transizione alle energie rinnovabili'),
  createBasicIssue('env-resources', 'Risorse naturali', 'Conservazione e uso sostenibile delle risorse naturali'),
  
  // Water Resources
  createBasicIssue('water-management', 'Gestione delle risorse idriche', 'Uso efficiente e sostenibile dell\'acqua e prevenzione dell\'inquinamento idrico'),
  createBasicIssue('water-scarcity', 'Scarsità d\'acqua', 'Gestione delle risorse idriche in aree soggette a stress idrico'),
  createBasicIssue('water-quality', 'Qualità dell\'acqua', 'Monitoraggio e miglioramento della qualità dell\'acqua'),
  createBasicIssue('water-efficiency', 'Efficienza idrica', 'Riduzione del consumo di acqua tramite tecnologie e processi efficienti'),
  createBasicIssue('water-recycling', 'Riciclo dell\'acqua', 'Implementazione di sistemi per il riutilizzo e il riciclo dell\'acqua'),
  createBasicIssue('water-pollution', 'Inquinamento idrico', 'Prevenzione e gestione dell\'inquinamento delle acque'),
  
  // Biodiversity
  createBasicIssue('biodiversity-conservation', 'Conservazione della biodiversità', 'Protezione degli ecosistemi e della diversità biologica'),
  createBasicIssue('biodiversity-restoration', 'Ripristino degli habitat', 'Iniziative per il ripristino degli ecosistemi danneggiati'),
  createBasicIssue('biodiversity-monitoring', 'Monitoraggio della biodiversità', 'Sistemi di monitoraggio e reporting sulla biodiversità'),
  createBasicIssue('biodiversity-impacts', 'Impatti sulla biodiversità', 'Valutazione e gestione degli impatti delle operazioni sulla biodiversità'),
  createBasicIssue('biodiversity-supply-chain', 'Biodiversità nella catena di approvvigionamento', 'Gestione sostenibile delle catene di approvvigionamento per proteggere la biodiversità'),

  // Circular Economy
  createBasicIssue('circular-waste', 'Gestione dei rifiuti', 'Riduzione, riciclo e gestione sostenibile dei rifiuti'),
  createBasicIssue('circular-recycling', 'Riciclo e riutilizzo', 'Promozione del riciclo e del riutilizzo dei materiali'),
  createBasicIssue('circular-design', 'Design circolare', 'Progettazione di prodotti per la durabilità, il riutilizzo e il riciclo'),
  createBasicIssue('circular-materials', 'Materiali sostenibili', 'Utilizzo di materiali sostenibili e a basso impatto ambientale'),
  createBasicIssue('circular-lifecycle', 'Ciclo di vita del prodotto', 'Gestione dell\'intero ciclo di vita del prodotto'),
  createBasicIssue('circular-innovation', 'Innovazione circolare', 'Sviluppo di nuove tecnologie e modelli di business circolari'),
  createBasicIssue('circular-packaging', 'Packaging sostenibile', 'Riduzione e miglioramento sostenibile degli imballaggi'),
  createBasicIssue('circular-recovery', 'Recupero delle risorse', 'Sistemi di recupero e riutilizzo delle risorse'),
  createBasicIssue('circular-production', 'Produzione sostenibile', 'Processi produttivi efficienti e a basso impatto ambientale'),
  createBasicIssue('circular-consumption', 'Consumo responsabile', 'Promozione di modelli di consumo sostenibili'),
  createBasicIssue('circular-business-models', 'Modelli di business circolari', 'Trasformazione verso modelli di business basati sui principi dell\'economia circolare'),
  createBasicIssue('circular-supply-chain', 'Catena di approvvigionamento circolare', 'Implementazione di pratiche circolari nella catena di approvvigionamento'),
  createBasicIssue('circular-metrics', 'Metriche di circolarità', 'Sviluppo e monitoraggio di indicatori di circolarità'),
  createBasicIssue('circular-policy', 'Politiche per l\'economia circolare', 'Contributo allo sviluppo di politiche che favoriscono l\'economia circolare'),
  
  // Workforce
  createBasicIssue('workforce-diversity', 'Diversità e inclusione', 'Promozione della diversità e dell\'inclusione sul posto di lavoro'),
  createBasicIssue('workforce-health', 'Salute e sicurezza', 'Tutela della salute e della sicurezza dei lavoratori'),
  createBasicIssue('workforce-development', 'Sviluppo delle competenze', 'Formazione e sviluppo delle competenze dei dipendenti'),
  
  // Social
  createBasicIssue('social-rights', 'Diritti umani', 'Rispetto e promozione dei diritti umani nelle operazioni aziendali e nella catena di fornitura'),
  createBasicIssue('social-community', 'Impegno comunitario', 'Relazioni con le comunità locali e contributo allo sviluppo sociale'),
  createBasicIssue('social-equality', 'Equità e pari opportunità', 'Promozione dell\'equità e delle pari opportunità in azienda'),
  createBasicIssue('social-impact', 'Impatto sociale', 'Valutazione e gestione dell\'impatto sociale delle operazioni aziendali'),
  createBasicIssue('social-engagement', 'Coinvolgimento degli stakeholder', 'Dialogo e collaborazione con gli stakeholder'),
  createBasicIssue('social-responsibility', 'Responsabilità sociale', 'Iniziative di responsabilità sociale d\'impresa'),
  createBasicIssue('social-philanthropy', 'Filantropia', 'Donazioni e sostegno a cause sociali'),
  
  // Supply Chain
  createBasicIssue('supply-chain-transparency', 'Trasparenza della catena di approvvigionamento', 'Miglioramento della trasparenza e della tracciabilità nella catena di fornitura'),
  createBasicIssue('supply-chain-assessment', 'Valutazione dei fornitori', 'Valutazione delle performance ESG dei fornitori'),
  createBasicIssue('supply-chain-engagement', 'Coinvolgimento dei fornitori', 'Collaborazione con i fornitori per migliorare le performance di sostenibilità'),
  createBasicIssue('supply-chain-risk', 'Gestione del rischio', 'Identificazione e gestione dei rischi ESG nella catena di fornitura'),
  createBasicIssue('supply-chain-standards', 'Standard etici', 'Implementazione di standard etici e di sostenibilità nella catena di fornitura'),
  createBasicIssue('supply-chain-audits', 'Audit dei fornitori', 'Conduzione di audit per verificare la conformità dei fornitori'),
  createBasicIssue('supply-chain-local', 'Approvvigionamento locale', 'Promozione dell\'approvvigionamento da fornitori locali'),
  createBasicIssue('supply-chain-capacity', 'Capacity building', 'Supporto allo sviluppo delle capacità dei fornitori in tema di sostenibilità'),
  createBasicIssue('supply-chain-innovation', 'Innovazione nella catena di fornitura', 'Implementazione di soluzioni innovative per una catena di fornitura più sostenibile'),
  createBasicIssue('supply-chain-collaboration', 'Collaborazione settoriale', 'Partecipazione a iniziative di settore per migliorare la sostenibilità della catena di fornitura'),
  
  // Governance
  createBasicIssue('gov-ethics', 'Etica aziendale', 'Promozione di pratiche aziendali etiche e trasparenti'),
  createBasicIssue('gov-anti-corruption', 'Anti-corruzione', 'Prevenzione della corruzione e delle pratiche commerciali scorrette'),
  createBasicIssue('gov-transparency', 'Trasparenza', 'Trasparenza nelle operazioni e nella reportistica aziendale'),
  createBasicIssue('gov-risk', 'Gestione del rischio', 'Identificazione, valutazione e gestione dei rischi aziendali'),
  createBasicIssue('gov-compliance', 'Conformità normativa', 'Rispetto delle leggi e dei regolamenti applicabili'),
  createBasicIssue('gov-board', 'Governance del consiglio', 'Composizione, indipendenza e diversità del consiglio di amministrazione'),
  createBasicIssue('gov-compensation', 'Politiche di remunerazione', 'Pratiche di remunerazione eque e trasparenti'),
  createBasicIssue('gov-sustainability', 'Governance della sostenibilità', 'Integrazione della sostenibilità nella governance aziendale'),
  createBasicIssue('gov-data', 'Protezione dei dati e privacy', 'Tutela dei dati personali e della privacy degli stakeholder'),
  
  // Consumers
  createBasicIssue('consumer-health', 'Salute e sicurezza dei prodotti', 'Garanzia della sicurezza e della qualità dei prodotti per i consumatori'),
  createBasicIssue('consumer-marketing', 'Marketing responsabile', 'Pratiche di marketing etiche e trasparenti'),
  createBasicIssue('consumer-information', 'Informazioni ai consumatori', 'Fornitura di informazioni accurate e complete sui prodotti'),
  createBasicIssue('consumer-privacy', 'Privacy dei consumatori', 'Protezione dei dati personali e della privacy dei consumatori'),
  createBasicIssue('consumer-feedback', 'Feedback dei consumatori', 'Raccolta e gestione del feedback dei consumatori'),
  createBasicIssue('consumer-quality', 'Qualità del servizio', 'Miglioramento continuo della qualità del servizio offerto ai consumatori'),
  createBasicIssue('consumer-education', 'Educazione dei consumatori', 'Iniziative per educare i consumatori su temi legati alla sostenibilità'),
  
  // Innovation
  createBasicIssue('innovation-r&d', 'Ricerca e sviluppo sostenibile', 'Investimenti in R&S per soluzioni sostenibili'),
  createBasicIssue('innovation-digitalization', 'Digitalizzazione', 'Utilizzo delle tecnologie digitali per migliorare la sostenibilità'),
  createBasicIssue('innovation-collaboration', 'Collaborazione per l\'innovazione', 'Partnership per lo sviluppo di soluzioni innovative'),
  createBasicIssue('innovation-startups', 'Supporto alle startup', 'Collaborazione con startup per promuovere l\'innovazione sostenibile'),
  createBasicIssue('innovation-impact', 'Valutazione dell\'impatto', 'Misurazione dell\'impatto delle innovazioni sulla sostenibilità'),
  createBasicIssue('innovation-open', 'Open innovation', 'Approccio aperto all\'innovazione per affrontare le sfide di sostenibilità'),
  createBasicIssue('innovation-scaling', 'Scaling delle soluzioni', 'Ampliamento della scala delle soluzioni innovative di successo')
];
