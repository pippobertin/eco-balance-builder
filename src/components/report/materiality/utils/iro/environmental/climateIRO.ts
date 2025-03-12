
import { IROData } from '../../../types';

export const climateIROData: Record<string, IROData> = {
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
  }
};
