
import { IROData } from '../../types';

// Climate, energy and pollution related IRO data
export const environmentalIROData: Record<string, IROData> = {
  // Climate adaptation and mitigation
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
  
  // Pollution
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
  }
};
