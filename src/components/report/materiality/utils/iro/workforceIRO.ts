
import { IROData } from '../../types';

// Own workforce related IRO data
export const workforceIROData: Record<string, IROData> = {
  'labor-working-conditions': {
    positiveImpacts: [
      'Miglioramento delle condizioni di lavoro',
      'Aumento della soddisfazione dei dipendenti',
      'Riduzione degli infortuni e delle malattie professionali',
      'Aumento della produttività'
    ],
    negativeImpacts: [
      'Costi di implementazione di miglioramenti',
      'Potenziale interruzione temporanea delle attività',
      'Necessità di aggiornamento dei processi',
      'Investimenti in infrastrutture'
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
    positiveImpacts: [
      'Riduzione degli infortuni e delle malattie professionali',
      'Miglioramento della salute e della sicurezza',
      'Aumento della produttività',
      'Diminuzione dei costi sanitari'
    ],
    negativeImpacts: [
      'Costi di implementazione di sistemi di sicurezza',
      'Investimenti in dispositivi di protezione',
      'Tempo dedicato alla formazione',
      'Spese di monitoraggio e reporting'
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
    positiveImpacts: [
      'Miglioramento del dialogo sociale',
      'Aumento della fiducia tra management e dipendenti',
      'Riduzione dei conflitti',
      'Aumento della produttività'
    ],
    negativeImpacts: [
      'Tempo dedicato alle consultazioni',
      'Necessità di strutture di rappresentanza',
      'Complessità nella gestione delle relazioni',
      'Potenziali ritardi decisionali'
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
    positiveImpacts: [
      'Promozione delle pari opportunità',
      'Aumento della diversità',
      'Miglioramento dell\'inclusione',
      'Aumento della produttività'
    ],
    negativeImpacts: [
      'Costi di implementazione di politiche inclusive',
      'Investimenti in formazione sulla diversità',
      'Adattamento dell\'ambiente di lavoro',
      'Spese per programmi specifici'
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
    positiveImpacts: [
      'Miglioramento del work-life balance',
      'Aumento della soddisfazione dei dipendenti',
      'Riduzione dello stress',
      'Aumento della produttività'
    ],
    negativeImpacts: [
      'Costi di implementazione di orari flessibili',
      'Investimenti in tecnologie per il lavoro remoto',
      'Complessità nella gestione di team distribuiti',
      'Potenziale riduzione della collaborazione spontanea'
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
    positiveImpacts: [
      'Miglioramento delle competenze dei dipendenti',
      'Aumento della produttività',
      'Innovazione',
      'Miglioramento della qualità dei prodotti e dei servizi'
    ],
    negativeImpacts: [
      'Costi di implementazione di programmi formativi',
      'Tempo sottratto alle attività produttive',
      'Investimenti in materiali e piattaforme',
      'Complessità nella valutazione dell\'efficacia'
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
