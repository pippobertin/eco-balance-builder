import { IROData } from '../types';

export const predefinedIROData: Record<string, IROData> = {
  // Impatti ambientali
  'climate-adaptation': {
    impacts: [
      'Riduzione della vulnerabilità agli eventi climatici estremi',
      'Protezione delle infrastrutture e degli asset aziendali',
      'Miglioramento della resilienza delle comunità locali',
      'Adattamento dei processi produttivi ai cambiamenti climatici'
    ],
    risks: [
      'Interruzioni operative dovute a eventi climatici',
      'Aumento dei costi assicurativi',
      'Danni alle infrastrutture e agli asset',
      'Perdita di produttività'
    ],
    opportunities: [
      'Sviluppo di nuovi prodotti e servizi per l\'adattamento climatico',
      'Accesso a finanziamenti e incentivi per la resilienza',
      'Miglioramento della reputazione aziendale',
      'Creazione di valore condiviso con le comunità locali'
    ],
    actions: [
      'Valutare i rischi climatici e sviluppare piani di adattamento',
      'Investire in infrastrutture resilienti',
      'Implementare misure di gestione del rischio climatico',
      'Collaborare con le comunità locali per promuovere la resilienza'
    ]
  },
  'climate-mitigation': {
    impacts: [
      'Riduzione delle emissioni di gas serra',
      'Contributo alla lotta contro il cambiamento climatico',
      'Miglioramento della qualità dell\'aria',
      'Promozione di un\'economia a basse emissioni di carbonio'
    ],
    risks: [
      'Aumento dei costi energetici',
      'Restrizioni normative sulle emissioni',
      'Danni reputazionali',
      'Perdita di competitività'
    ],
    opportunities: [
      'Riduzione dei costi energetici attraverso l\'efficienza',
      'Accesso a finanziamenti e incentivi per le energie rinnovabili',
      'Sviluppo di nuovi prodotti e servizi a basse emissioni',
      'Miglioramento della reputazione aziendale'
    ],
    actions: [
      'Misurare e ridurre le emissioni di gas serra',
      'Investire in efficienza energetica',
      'Utilizzare fonti di energia rinnovabile',
      'Compensare le emissioni residue'
    ]
  },
  'energy': {
    impacts: [
      'Riduzione dei consumi energetici',
      'Utilizzo di fonti rinnovabili',
      'Diminuzione dell\'impatto ambientale',
      'Efficienza energetica'
    ],
    risks: [
      'Aumento dei costi energetici',
      'Interruzioni nella fornitura di energia',
      'Dipendenza da fonti non rinnovabili',
      'Inefficienze nei processi produttivi'
    ],
    opportunities: [
      'Riduzione dei costi attraverso l\'efficienza energetica',
      'Accesso a incentivi per le energie rinnovabili',
      'Miglioramento della resilienza energetica',
      'Creazione di nuovi prodotti e servizi energetici'
    ],
    actions: [
      'Implementare sistemi di gestione dell\'energia',
      'Effettuare audit energetici',
      'Investire in tecnologie efficienti',
      'Utilizzare fonti rinnovabili'
    ]
  },
  
  // Inquinamento
  'pollution-air': {
    impacts: [
      'Miglioramento della qualità dell\'aria',
      'Riduzione delle malattie respiratorie',
      'Protezione degli ecosistemi',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di bonifica',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di bonifica',
      'Innovazione tecnologica'
    ],
    actions: [
      'Monitorare le emissioni atmosferiche',
      'Utilizzare tecnologie di abbattimento',
      'Ridurre l\'uso di sostanze inquinanti',
      'Compensare le emissioni residue'
    ]
  },
  'pollution-water': {
    impacts: [
      'Miglioramento della qualità dell\'acqua',
      'Protezione della biodiversità acquatica',
      'Riduzione delle malattie idriche',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di bonifica',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di bonifica',
      'Innovazione tecnologica'
    ],
    actions: [
      'Monitorare gli scarichi idrici',
      'Utilizzare tecnologie di depurazione',
      'Ridurre l\'uso di sostanze inquinanti',
      'Compensare gli scarichi residui'
    ]
  },
  'pollution-soil': {
    impacts: [
      'Miglioramento della qualità del suolo',
      'Protezione della biodiversità del suolo',
      'Riduzione della contaminazione',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di bonifica',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di bonifica',
      'Innovazione tecnologica'
    ],
    actions: [
      'Monitorare la qualità del suolo',
      'Utilizzare pratiche agricole sostenibili',
      'Ridurre l\'uso di sostanze inquinanti',
      'Bonificare i siti contaminati'
    ]
  },
  'pollution-organisms': {
    impacts: [
      'Protezione degli organismi viventi',
      'Riduzione della contaminazione alimentare',
      'Miglioramento della salute umana',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di bonifica',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di bonifica',
      'Innovazione tecnologica'
    ],
    actions: [
      'Monitorare la contaminazione degli organismi',
      'Utilizzare pratiche agricole sostenibili',
      'Ridurre l\'uso di sostanze inquinanti',
      'Garantire la sicurezza alimentare'
    ]
  },
  'substances-concern': {
    impacts: [
      'Riduzione dell\'uso di sostanze pericolose',
      'Miglioramento della salute e della sicurezza',
      'Protezione dell\'ambiente',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di gestione',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di gestione',
      'Innovazione tecnologica'
    ],
    actions: [
      'Identificare le sostanze pericolose utilizzate',
      'Sostituire le sostanze pericolose con alternative più sicure',
      'Implementare misure di gestione del rischio',
      'Formare i dipendenti sull\'uso sicuro delle sostanze'
    ]
  },
  'substances-extreme-concern': {
    impacts: [
      'Eliminazione delle sostanze estremamente pericolose',
      'Miglioramento della salute e della sicurezza',
      'Protezione dell\'ambiente',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di gestione',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di gestione',
      'Innovazione tecnologica'
    ],
    actions: [
      'Identificare le sostanze estremamente pericolose utilizzate',
      'Eliminare l\'uso delle sostanze estremamente pericolose',
      'Sostituire le sostanze estremamente pericolose con alternative più sicure',
      'Gestire i rifiuti contenenti sostanze estremamente pericolose'
    ]
  },
  
  // Acqua e risorse marine
  'water-consumption': {
    impacts: [
      'Riduzione del consumo idrico',
      'Preservazione delle risorse idriche',
      'Miglioramento dell\'efficienza idrica',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Aumento dei costi dell\'acqua',
      'Restrizioni sull\'uso dell\'acqua',
      'Interruzioni nella fornitura di acqua',
      'Danni reputazionali'
    ],
    opportunities: [
      'Riduzione dei costi attraverso l\'efficienza idrica',
      'Accesso a incentivi per la gestione sostenibile dell\'acqua',
      'Miglioramento della resilienza idrica',
      'Creazione di nuovi prodotti e servizi per la gestione dell\'acqua'
    ],
    actions: [
      'Misurare e ridurre il consumo idrico',
      'Utilizzare tecnologie efficienti',
      'Riciclare e riutilizzare l\'acqua',
      'Gestire le acque meteoriche'
    ]
  },
  'water-withdrawal': {
    impacts: [
      'Gestione sostenibile dei prelievi idrici',
      'Protezione degli ecosistemi acquatici',
      'Miglioramento della disponibilità di acqua',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Aumento dei costi di prelievo',
      'Restrizioni sui prelievi idrici',
      'Interruzioni nella fornitura di acqua',
      'Danni reputazionali'
    ],
    opportunities: [
      'Riduzione dei costi attraverso la gestione efficiente',
      'Accesso a incentivi per la gestione sostenibile dell\'acqua',
      'Miglioramento della resilienza idrica',
      'Creazione di nuovi prodotti e servizi per la gestione dell\'acqua'
    ],
    actions: [
      'Misurare e gestire i prelievi idrici',
      'Utilizzare tecnologie efficienti',
      'Rispettare i limiti di prelievo',
      'Collaborare con le autorità locali'
    ]
  },
  'water-discharge': {
    impacts: [
      'Riduzione dell\'inquinamento idrico',
      'Protezione degli ecosistemi acquatici',
      'Miglioramento della qualità dell\'acqua',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di depurazione',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di depurazione',
      'Innovazione tecnologica'
    ],
    actions: [
      'Monitorare gli scarichi idrici',
      'Utilizzare tecnologie di depurazione',
      'Ridurre l\'uso di sostanze inquinanti',
      'Compensare gli scarichi residui'
    ]
  },
  'ocean-discharge': {
    impacts: [
      'Protezione degli ecosistemi marini',
      'Riduzione dell\'inquinamento degli oceani',
      'Miglioramento della qualità dell\'acqua marina',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di depurazione',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di depurazione',
      'Innovazione tecnologica'
    ],
    actions: [
      'Monitorare gli scarichi negli oceani',
      'Utilizzare tecnologie di depurazione avanzate',
      'Ridurre l\'uso di sostanze inquinanti',
      'Compensare gli scarichi residui'
    ]
  },
  'marine-resources': {
    impacts: [
      'Utilizzo sostenibile delle risorse marine',
      'Protezione della biodiversità marina',
      'Miglioramento della gestione delle risorse',
      'Diminuzione dell\'impatto ambientale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di gestione',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di gestione',
      'Innovazione tecnologica'
    ],
    actions: [
      'Gestire in modo sostenibile le attività di pesca',
      'Proteggere gli habitat marini',
      'Ridurre l\'inquinamento marino',
      'Promuovere la ricerca scientifica'
    ]
  },
  
  // Biodiversità ed ecosistemi
  'biodiversity-climate': {
    impacts: [
      'Protezione della biodiversità',
      'Mantenimento degli ecosistemi',
      'Adattamento ai cambiamenti climatici',
      'Mitigazione dei cambiamenti climatici'
    ],
    risks: [
      'Perdita di biodiversità',
      'Degrado degli ecosistemi',
      'Aumento dei rischi climatici',
      'Danni reputazionali'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Accesso a finanziamenti per la biodiversità',
      'Creazione di nuovi prodotti e servizi ecologici'
    ],
    actions: [
      'Valutare l\'impatto sulla biodiversità',
      'Proteggere gli habitat naturali',
      'Ripristinare gli ecosistemi degradati',
      'Compensare la perdita di biodiversità'
    ]
  },
  'biodiversity-land-use': {
    impacts: [
      'Gestione sostenibile del territorio',
      'Protezione della biodiversità',
      'Mantenimento degli ecosistemi',
      'Riduzione dell\'impatto ambientale'
    ],
    risks: [
      'Perdita di biodiversità',
      'Degrado degli ecosistemi',
      'Aumento dei rischi ambientali',
      'Danni reputazionali'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Accesso a finanziamenti per la biodiversità',
      'Creazione di nuovi prodotti e servizi ecologici'
    ],
    actions: [
      'Valutare l\'impatto sull\'uso del suolo',
      'Pianificare l\'uso del suolo in modo sostenibile',
      'Proteggere gli habitat naturali',
      'Ripristinare gli ecosistemi degradati'
    ]
  },
  'biodiversity-water-use': {
    impacts: [
      'Gestione sostenibile delle risorse idriche',
      'Protezione della biodiversità acquatica',
      'Mantenimento degli ecosistemi acquatici',
      'Riduzione dell\'impatto ambientale'
    ],
    risks: [
      'Perdita di biodiversità acquatica',
      'Degrado degli ecosistemi acquatici',
      'Aumento dei rischi ambientali',
      'Danni reputazionali'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Accesso a finanziamenti per la biodiversità',
      'Creazione di nuovi prodotti e servizi ecologici'
    ],
    actions: [
      'Valutare l\'impatto sull\'uso dell\'acqua',
      'Gestire l\'acqua in modo sostenibile',
      'Proteggere gli habitat acquatici',
      'Ripristinare gli ecosistemi degradati'
    ]
  },
  'biodiversity-pollution': {
    impacts: [
      'Riduzione dell\'inquinamento',
      'Protezione della biodiversità',
      'Mantenimento degli ecosistemi',
      'Miglioramento della salute umana'
    ],
    risks: [
      'Perdita di biodiversità',
      'Degrado degli ecosistemi',
      'Aumento dei rischi per la salute',
      'Danni reputazionali'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Accesso a finanziamenti per la biodiversità',
      'Creazione di nuovi prodotti e servizi ecologici'
    ],
    actions: [
      'Ridurre l\'inquinamento',
      'Proteggere gli habitat naturali',
      'Ripristinare gli ecosistemi degradati',
      'Monitorare la qualità dell\'ambiente'
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
      'Dipendenza da risorse scarse o critiche',
      'Inefficienze nei processi produttivi'
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
      'Riduzione dei rifiuti',
      'Aumento del riciclo e del riutilizzo',
      'Diminuzione dell\'inquinamento',
      'Preservazione delle risorse naturali'
    ],
    risks: [
      'Aumento dei costi di smaltimento',
      'Sanzioni normative',
      'Danni reputazionali',
      'Perdita di valore dei materiali'
    ],
    opportunities: [
      'Creazione di nuovi mercati per i materiali riciclati',
      'Riduzione dei costi di smaltimento',
      'Miglioramento dell\'immagine aziendale',
      'Innovazione tecnologica'
    ],
    actions: [
      'Implementare sistemi di gestione dei rifiuti',
      'Promuovere il riciclo e il riutilizzo',
      'Progettare prodotti per la riciclabilità',
      'Collaborare con le aziende di riciclo'
    ]
  },
  'waste': {
    impacts: [
      'Riduzione della produzione di rifiuti',
      'Aumento del riciclo e del riutilizzo',
      'Diminuzione dell\'inquinamento',
      'Preservazione delle risorse naturali'
    ],
    risks: [
      'Aumento dei costi di smaltimento',
      'Sanzioni normative',
      'Danni reputazionali',
      'Perdita di valore dei materiali'
    ],
    opportunities: [
      'Creazione di nuovi mercati per i materiali riciclati',
      'Riduzione dei costi di smaltimento',
      'Miglioramento dell\'immagine aziendale',
      'Innovazione tecnologica'
    ],
    actions: [
      'Implementare sistemi di gestione dei rifiuti',
      'Promuovere il riciclo e il riutilizzo',
      'Progettare prodotti per la riciclabilità',
      'Collaborare con le aziende di riciclo'
    ]
  },
  
  // Forza lavoro propria
  'labor-working-conditions': {
    impacts: [
      'Miglioramento delle condizioni di lavoro',
      'Aumento della soddisfazione dei dipendenti',
      'Riduzione degli infortuni e delle malattie professionali',
      'Aumento della produttività'
    ],
    risks: [
      'Aumento dei costi del lavoro',
      'Sanzioni normative',
      'Danni reputazionali',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di talenti',
      'Riduzione del turnover',
      'Aumento della motivazione dei dipendenti'
    ],
    actions: [
      'Valutare le condizioni di lavoro',
      'Implementare misure di miglioramento',
      'Formare i dipendenti sulla sicurezza',
      'Promuovere la salute e il benessere'
    ]
  },
  'labor-health-safety': {
    impacts: [
      'Riduzione degli infortuni e delle malattie professionali',
      'Miglioramento della salute e della sicurezza',
      'Aumento della produttività',
      'Diminuzione dei costi sanitari'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi assicurativi',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di talenti',
      'Riduzione del turnover',
      'Aumento della motivazione dei dipendenti'
    ],
    actions: [
      'Valutare i rischi per la salute e la sicurezza',
      'Implementare misure di prevenzione',
      'Formare i dipendenti sulla sicurezza',
      'Fornire dispositivi di protezione individuale'
    ]
  },
  'labor-social-dialogue': {
    impacts: [
      'Miglioramento del dialogo sociale',
      'Aumento della fiducia tra management e dipendenti',
      'Riduzione dei conflitti',
      'Aumento della produttività'
    ],
    risks: [
      'Aumento dei costi di negoziazione',
      'Ritardi nelle decisioni',
      'Perdita di flessibilità',
      'Danni reputazionali'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di talenti',
      'Riduzione del turnover',
      'Aumento della motivazione dei dipendenti'
    ],
    actions: [
      'Implementare sistemi di dialogo sociale',
      'Consultare i dipendenti sulle decisioni importanti',
      'Negoziare accordi collettivi',
      'Promuovere la partecipazione dei dipendenti'
    ]
  },
  'labor-equal-opportunities': {
    impacts: [
      'Promozione delle pari opportunità',
      'Aumento della diversità',
      'Miglioramento dell\'inclusione',
      'Aumento della produttività'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Perdita di talenti',
      'Aumento dei conflitti'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di talenti',
      'Riduzione del turnover',
      'Aumento della motivazione dei dipendenti'
    ],
    actions: [
      'Implementare politiche di pari opportunità',
      'Promuovere la diversità',
      'Garantire l\'inclusione',
      'Formare i dipendenti sulla diversità'
    ]
  },
  'labor-work-life-balance': {
    impacts: [
      'Miglioramento del work-life balance',
      'Aumento della soddisfazione dei dipendenti',
      'Riduzione dello stress',
      'Aumento della produttività'
    ],
    risks: [
      'Aumento dei costi del lavoro',
      'Perdita di produttività',
      'Aumento dell\'assenteismo',
      'Danni reputazionali'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di talenti',
      'Riduzione del turnover',
      'Aumento della motivazione dei dipendenti'
    ],
    actions: [
      'Implementare politiche di work-life balance',
      'Offrire flessibilità',
      'Promuovere la salute e il benessere',
      'Supportare i dipendenti con responsabilità familiari'
    ]
  },
  'labor-training-development': {
    impacts: [
      'Miglioramento delle competenze dei dipendenti',
      'Aumento della produttività',
      'Innovazione',
      'Miglioramento della qualità dei prodotti e dei servizi'
    ],
    risks: [
      'Aumento dei costi di formazione',
      'Perdita di produttività durante la formazione',
      'Rischio di obsolescenza delle competenze',
      'Danni reputazionali'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di talenti',
      'Riduzione del turnover',
      'Aumento della motivazione dei dipendenti'
    ],
    actions: [
      'Valutare le esigenze di formazione',
      'Implementare programmi di formazione',
      'Offrire opportunità di sviluppo professionale',
      'Valutare l\'efficacia della formazione'
    ]
  },
  
  // Lavoratori nella catena del valore
  'labor-child': {
    impacts: [
      'Prevenzione e contrasto del lavoro minorile',
      'Miglioramento delle condizioni di vita dei bambini',
      'Aumento dell\'istruzione',
      'Riduzione della povertà'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Boicottaggio dei prodotti',
      'Perdita di clienti'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Aumento della fiducia dei consumatori',
      'Miglioramento delle relazioni con le comunità locali'
    ],
    actions: [
      'Implementare politiche contro il lavoro minorile',
      'Monitorare la catena di fornitura',
      'Collaborare con organizzazioni per la protezione dei bambini',
      'Sensibilizzare i dipendenti e i fornitori'
    ]
  },
  'labor-forced': {
    impacts: [
      'Prevenzione e contrasto del lavoro forzato',
      'Miglioramento delle condizioni di vita dei lavoratori',
      'Aumento della libertà e della dignità',
      'Riduzione della povertà'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Boicottaggio dei prodotti',
      'Perdita di clienti'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Aumento della fiducia dei consumatori',
      'Miglioramento delle relazioni con le comunità locali'
    ],
    actions: [
      'Implementare politiche contro il lavoro forzato',
      'Monitorare la catena di fornitura',
      'Collaborare con organizzazioni per i diritti umani',
      'Sensibilizzare i dipendenti e i fornitori'
    ]
  },
  'labor-adequate-wages': {
    impacts: [
      'Miglioramento delle condizioni di vita dei lavoratori',
      'Aumento del potere d\'acquisto',
      'Riduzione della povertà',
      'Aumento della produttività'
    ],
    risks: [
      'Aumento dei costi del lavoro',
      'Sanzioni normative',
      'Danni reputazionali',
      'Perdita di competitività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di talenti',
      'Riduzione del turnover',
      'Aumento della motivazione dei dipendenti'
    ],
    actions: [
      'Pagare salari adeguati',
      'Garantire condizioni di lavoro dignitose',
      'Rispettare i diritti dei lavoratori',
      'Promuovere il dialogo sociale'
    ]
  },
  'labor-freedom-association': {
    impacts: [
      'Miglioramento del dialogo sociale',
      'Aumento della fiducia tra management e lavoratori',
      'Riduzione dei conflitti',
      'Aumento della produttività'
    ],
    risks: [
      'Aumento dei costi di negoziazione',
      'Ritardi nelle decisioni',
      'Perdita di flessibilità',
      'Danni reputazionali'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di talenti',
      'Riduzione del turnover',
      'Aumento della motivazione dei dipendenti'
    ],
    actions: [
      'Rispettare la libertà di associazione',
      'Promuovere il dialogo sociale',
      'Negoziare accordi collettivi',
      'Coinvolgere i lavoratori nelle decisioni'
    ]
  },
  'labor-collective-bargaining': {
    impacts: [
      'Miglioramento delle condizioni di lavoro',
      'Aumento della soddisfazione dei lavoratori',
      'Riduzione dei conflitti',
      'Aumento della produttività'
    ],
    risks: [
      'Aumento dei costi del lavoro',
      'Ritardi nelle decisioni',
      'Perdita di flessibilità',
      'Danni reputazionali'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di talenti',
      'Riduzione del turnover',
      'Aumento della motivazione dei dipendenti'
    ],
    actions: [
      'Negoziare accordi collettivi',
      'Rispettare i diritti dei lavoratori',
      'Promuovere il dialogo sociale',
      'Coinvolgere i lavoratori nelle decisioni'
    ]
  },
  
  // Comunità interessate
  'community-local-impacts': {
    impacts: [
      'Miglioramento delle condizioni di vita delle comunità locali',
      'Creazione di posti di lavoro',
      'Sviluppo economico',
      'Protezione dell\'ambiente'
    ],
    risks: [
      'Conflitti con le comunità locali',
      'Danni reputazionali',
      'Ritardi nei progetti',
      'Aumento dei costi'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Miglioramento delle relazioni con le comunità locali',
      'Creazione di valore condiviso'
    ],
    actions: [
      'Consultare le comunità locali',
      'Valutare l\'impatto dei progetti',
      'Mitigare gli impatti negativi',
      'Creare benefici per le comunità locali'
    ]
  },
  'community-human-rights': {
    impacts: [
      'Protezione dei diritti umani',
      'Miglioramento delle condizioni di vita',
      'Riduzione della povertà',
      'Sviluppo sociale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Boicottaggio dei prodotti',
      'Perdita di clienti'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Aumento della fiducia dei consumatori',
      'Miglioramento delle relazioni con le comunità locali'
    ],
    actions: [
      'Rispettare i diritti umani',
      'Valutare l\'impatto sui diritti umani',
      'Mitigare gli impatti negativi',
      'Promuovere i diritti umani'
    ]
  },
  'community-access-resources': {
    impacts: [
      'Miglioramento dell\'accesso alle risorse',
      'Sviluppo economico',
      'Riduzione della povertà',
      'Miglioramento delle condizioni di vita'
    ],
    risks: [
      'Conflitti con le comunità locali',
      'Danni reputazionali',
      'Ritardi nei progetti',
      'Aumento dei costi'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Miglioramento delle relazioni con le comunità locali',
      'Creazione di valore condiviso'
    ],
    actions: [
      'Consultare le comunità locali',
      'Valutare l\'impatto dei progetti',
      'Mitigare gli impatti negativi',
      'Creare benefici per le comunità locali'
    ]
  },
  
  // Consumatori e utilizzatori finali
  'consumer-health-safety': {
    impacts: [
      'Protezione della salute e della sicurezza dei consumatori',
      'Miglioramento della qualità dei prodotti',
      'A
