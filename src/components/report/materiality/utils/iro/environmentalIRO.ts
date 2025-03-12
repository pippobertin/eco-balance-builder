import { IROData } from '../../types';

export const environmentalIROData: Record<string, IROData> = {
  'climate-adaptation': {
    positiveImpacts: [
      'Miglioramento della resilienza aziendale',
      'Protezione delle infrastrutture critiche',
      'Rafforzamento della continuità operativa',
      'Sviluppo di competenze specialistiche'
    ],
    negativeImpacts: [
      'Costi di adattamento elevati',
      'Possibile riduzione temporanea della produttività',
      'Necessità di modificare processi consolidati',
      'Impatto su alcune attività tradizionali'
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
    positiveImpacts: [
      'Riduzione dell\'impronta carbonica',
      'Efficienza energetica migliorata',
      'Innovazione tecnologica nel settore green',
      'Creazione di nuovi mercati sostenibili'
    ],
    negativeImpacts: [
      'Investimenti iniziali elevati',
      'Rimodulazione dei processi produttivi',
      'Necessità di formazione del personale',
      'Potenziale perdita di competitività a breve termine'
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
    positiveImpacts: [
      'Ottimizzazione dei consumi energetici',
      'Integrazione di fonti rinnovabili',
      'Riduzione dei costi operativi',
      'Miglioramento dell\'immagine aziendale'
    ],
    negativeImpacts: [
      'Costi iniziali per l\'installazione di nuove tecnologie',
      'Necessità di manutenzione specializzata',
      'Dipendenza dalle condizioni ambientali (es. solare, eolico)',
      'Possibili interruzioni nella fornitura durante la transizione'
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
  'pollution-air': {
    positiveImpacts: [
      'Miglioramento della qualità dell\'aria',
      'Riduzione delle emissioni nocive',
      'Benefici per la salute pubblica',
      'Conformità alle normative ambientali'
    ],
    negativeImpacts: [
      'Costi per l\'installazione di sistemi di filtraggio',
      'Necessità di monitoraggio costante',
      'Possibili interruzioni della produzione per manutenzione',
      'Difficoltà nel gestire emissioni impreviste'
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
    positiveImpacts: [
      'Miglioramento della qualità delle acque',
      'Protezione degli ecosistemi acquatici',
      'Riduzione dell\'inquinamento idrico',
      'Utilizzo sostenibile delle risorse idriche'
    ],
    negativeImpacts: [
      'Costi per il trattamento delle acque reflue',
      'Necessità di monitoraggio costante',
      'Possibili restrizioni sull\'uso dell\'acqua',
      'Difficoltà nel gestire sversamenti accidentali'
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
    positiveImpacts: [
      'Miglioramento della qualità del suolo',
      'Riduzione della contaminazione',
      'Promozione di pratiche agricole sostenibili',
      'Protezione della biodiversità del suolo'
    ],
    negativeImpacts: [
      'Costi per la bonifica dei terreni contaminati',
      'Restrizioni sull\'uso del suolo',
      'Necessità di monitoraggio costante',
      'Difficoltà nel gestire sversamenti accidentali'
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
    positiveImpacts: [
      'Protezione della salute degli organismi viventi',
      'Riduzione della contaminazione alimentare',
      'Miglioramento della sicurezza alimentare',
      'Promozione di ecosistemi sani'
    ],
    negativeImpacts: [
      'Costi per il monitoraggio della contaminazione',
      'Restrizioni sull\'uso di pesticidi e erbicidi',
      'Necessità di pratiche agricole biologiche',
      'Difficoltà nel gestire contaminazioni accidentali'
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
    positiveImpacts: [
      'Riduzione dell\'uso di sostanze pericolose',
      'Miglioramento della salute e della sicurezza',
      'Protezione dell\'ambiente',
      'Conformità alle normative ambientali'
    ],
    negativeImpacts: [
      'Costi per la sostituzione delle sostanze',
      'Necessità di formazione del personale',
      'Possibili restrizioni sull\'uso di alcune sostanze',
      'Difficoltà nel trovare alternative sicure'
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
    positiveImpacts: [
      'Eliminazione delle sostanze estremamente pericolose',
      'Miglioramento della salute e della sicurezza',
      'Protezione dell\'ambiente',
      'Conformità alle normative ambientali'
    ],
    negativeImpacts: [
      'Costi per la sostituzione delle sostanze',
      'Necessità di processi di smaltimento speciali',
      'Possibili restrizioni sull\'uso di alcune sostanze',
      'Difficoltà nel trovare alternative sicure'
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
