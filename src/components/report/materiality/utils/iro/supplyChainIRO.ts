
import { IROData } from '../../types';

// Workers in the value chain related IRO data
export const supplyChainIROData: Record<string, IROData> = {
  'labor-child': {
    positiveImpacts: [
      'Prevenzione e contrasto del lavoro minorile',
      'Miglioramento delle condizioni di vita dei bambini',
      'Aumento dell\'istruzione',
      'Riduzione della povertà'
    ],
    negativeImpacts: [
      'Costi di monitoraggio della catena di fornitura',
      'Potenziali interruzioni di fornitura',
      'Investimenti in programmi alternativi',
      'Complessità nel gestire fornitori esteri'
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
    positiveImpacts: [
      'Prevenzione e contrasto del lavoro forzato',
      'Miglioramento delle condizioni di vita dei lavoratori',
      'Aumento della libertà e della dignità',
      'Riduzione della povertà'
    ],
    negativeImpacts: [
      'Costi di monitoraggio della catena di fornitura',
      'Potenziali interruzioni di fornitura',
      'Investimenti in programmi di supporto',
      'Complessità nel verificare condizioni di lavoro remote'
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
    positiveImpacts: [
      'Miglioramento delle condizioni di vita dei lavoratori',
      'Aumento del potere d\'acquisto',
      'Riduzione della povertà',
      'Aumento della produttività'
    ],
    negativeImpacts: [
      'Aumento dei costi di produzione',
      'Potenziale riduzione dei margini',
      'Complessità nel determinare salari adeguati',
      'Disparità tra diversi mercati geografici'
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
    positiveImpacts: [
      'Miglioramento del dialogo sociale',
      'Aumento della fiducia tra management e lavoratori',
      'Riduzione dei conflitti',
      'Aumento della produttività'
    ],
    negativeImpacts: [
      'Complessità nella gestione delle relazioni sindacali',
      'Potenziali tensioni nei processi negoziali',
      'Costi di gestione dei processi partecipativi',
      'Limitazioni operative in alcuni paesi'
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
    positiveImpacts: [
      'Miglioramento delle condizioni di lavoro',
      'Aumento della soddisfazione dei lavoratori',
      'Riduzione dei conflitti',
      'Aumento della produttività'
    ],
    negativeImpacts: [
      'Complessità nei processi di negoziazione',
      'Potenziali ritardi decisionali',
      'Costi associati alla contrattazione',
      'Limitazioni alla flessibilità operativa'
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
  }
};
