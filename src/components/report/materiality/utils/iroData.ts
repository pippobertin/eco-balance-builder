
import { IROData } from '../types';

export const predefinedIROData: Record<string, IROData> = {
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
      'Dipendenza da risorse scarse o non rinnovabili',
      'Aumento dei costi di produzione dovuti a risorse limitate'
    ],
    opportunities: [
      'Sviluppo di prodotti con materiali riciclati o rinnovabili',
      'Creazione di nuovi modelli di business circolari',
      'Riduzione dei costi attraverso l\'uso efficiente delle risorse',
      'Miglioramento della resilienza della catena di approvvigionamento'
    ],
    actions: [
      'Implementare strategie di approvvigionamento sostenibile',
      'Progettare prodotti per la durabilità e la riciclabilità',
      'Ottimizzare i processi per ridurre gli sprechi',
      'Collaborare con i fornitori per promuovere l\'economia circolare'
    ]
  },
  'resource-outflows': {
    impacts: [
      'Riduzione dei rifiuti generati dai prodotti a fine vita',
      'Diminuzione dell\'inquinamento legato allo smaltimento dei rifiuti',
      'Recupero di materiali di valore dai flussi di scarto',
      'Creazione di nuovi mercati per i materiali riciclati'
    ],
    risks: [
      'Costi elevati per la gestione dei rifiuti',
      'Responsabilità estesa del produttore',
      'Restrizioni normative sullo smaltimento dei rifiuti',
      'Danni reputazionali legati alla gestione inadeguata dei rifiuti'
    ],
    opportunities: [
      'Sviluppo di sistemi di raccolta e riciclo efficienti',
      'Innovazione nei processi di trattamento dei rifiuti',
      'Creazione di nuovi prodotti dai materiali riciclati',
      'Riduzione dei costi attraverso il recupero di risorse'
    ],
    actions: [
      'Implementare sistemi di raccolta differenziata',
      'Investire in tecnologie di riciclo avanzate',
      'Progettare prodotti per il disassemblaggio e il recupero dei materiali',
      'Collaborare con le autorità locali per la gestione dei rifiuti'
    ]
  },
  'waste': {
    impacts: [
      'Riduzione della quantità totale di rifiuti generati',
      'Diminuzione degli impatti ambientali dello smaltimento',
      'Miglioramento dell\'efficienza nell\'uso delle risorse',
      'Promozione di un\'economia circolare'
    ],
    risks: [
      'Aumento dei costi di smaltimento dei rifiuti',
      'Responsabilità per la contaminazione dei siti di smaltimento',
      'Restrizioni normative sullo smaltimento dei rifiuti',
      'Danni reputazionali legati alla gestione dei rifiuti'
    ],
    opportunities: [
      'Implementazione di strategie di prevenzione dei rifiuti',
      'Riciclo e riutilizzo dei materiali di scarto',
      'Valorizzazione energetica dei rifiuti non riciclabili',
      'Riduzione dei costi attraverso la minimizzazione dei rifiuti'
    ],
    actions: [
      'Condurre audit dei rifiuti per identificare le aree di miglioramento',
      'Implementare programmi di riduzione dei rifiuti alla fonte',
      'Investire in tecnologie di riciclo e recupero',
      'Educare i dipendenti sulle pratiche di gestione dei rifiuti'
    ]
  },
  
  // Lavoro e diritti umani
  'labor-secure': {
    impacts: [
      'Miglioramento delle condizioni di lavoro per i dipendenti',
      'Aumento della sicurezza sul lavoro',
      'Riduzione del rischio di incidenti e infortuni',
      'Miglioramento del benessere dei lavoratori'
    ],
    risks: [
      'Incidenti sul lavoro e infortuni',
      'Sanzioni normative per violazioni delle leggi sul lavoro',
      'Azioni legali da parte dei dipendenti',
      'Danni reputazionali legati alle cattive condizioni di lavoro'
    ],
    opportunities: [
      'Miglioramento della produttività e della qualità del lavoro',
      'Riduzione dell\'assenteismo e del turnover',
      'Miglioramento del morale dei dipendenti',
      'Attrazione e fidelizzazione dei talenti'
    ],
    actions: [
      'Implementare sistemi di gestione della sicurezza sul lavoro',
      'Fornire formazione e attrezzature adeguate ai dipendenti',
      'Monitorare e valutare regolarmente le condizioni di lavoro',
      'Coinvolgere i dipendenti nella definizione delle politiche di sicurezza'
    ]
  },
  'labor-wages': {
    impacts: [
      'Garantire salari adeguati e dignitosi ai lavoratori',
      'Miglioramento del tenore di vita dei dipendenti',
      'Riduzione della povertà e della disuguaglianza',
      'Stimolo della domanda interna'
    ],
    risks: [
      'Sanzioni normative per violazioni delle leggi sul salario minimo',
      'Azioni legali da parte dei dipendenti',
      'Riduzione del morale e della motivazione dei dipendenti',
      'Difficoltà ad attrarre e fidelizzare i talenti'
    ],
    opportunities: [
      'Miglioramento della produttività e della qualità del lavoro',
      'Riduzione dell\'assenteismo e del turnover',
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili'
    ],
    actions: [
      'Pagare salari superiori al minimo legale',
      'Fornire benefit e incentivi ai dipendenti',
      'Promuovere la trasparenza salariale',
      'Coinvolgere i dipendenti nella definizione delle politiche salariali'
    ]
  }
};
