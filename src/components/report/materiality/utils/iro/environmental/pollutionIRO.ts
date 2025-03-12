
import { IROData } from '../../../types';

export const pollutionIROData: Record<string, IROData> = {
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
  }
};
