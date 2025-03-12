
import { IROData } from '../../types';

// Own workforce related IRO data
export const workforceIROData: Record<string, IROData> = {
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
  }
};
