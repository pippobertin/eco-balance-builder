
import { IROData } from '../../types';

// Consumers and end-users related IRO data
export const consumerIROData: Record<string, IROData> = {
  'consumer-health-safety': {
    impacts: [
      'Protezione della salute e della sicurezza dei consumatori',
      'Miglioramento della qualità dei prodotti',
      'Aumento della fiducia dei consumatori',
      'Riduzione degli incidenti legati ai prodotti'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Azioni legali',
      'Perdita di clienti'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di consumatori attenti alla salute',
      'Sviluppo di prodotti più sicuri',
      'Differenziazione sul mercato'
    ],
    actions: [
      'Valutare i rischi per la salute e la sicurezza',
      'Implementare sistemi di controllo qualità',
      'Formare i dipendenti sulla sicurezza dei prodotti',
      'Comunicare in modo trasparente con i consumatori'
    ]
  }
};
