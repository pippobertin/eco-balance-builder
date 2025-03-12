
import { IROData } from '../../../types';

export const substancesIROData: Record<string, IROData> = {
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
