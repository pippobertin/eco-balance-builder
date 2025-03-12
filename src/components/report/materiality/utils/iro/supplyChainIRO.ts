
import { IROData } from '../../types';

// Workers in the value chain related IRO data
export const supplyChainIROData: Record<string, IROData> = {
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
  }
};
