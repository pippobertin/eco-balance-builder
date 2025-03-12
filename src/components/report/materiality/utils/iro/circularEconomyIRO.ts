
import { IROData } from '../../types';

// Circular economy related IRO data
export const circularEconomyIROData: Record<string, IROData> = {
  'resource-inflows': {
    positiveImpacts: [
      'Riduzione dell\'utilizzo di materie prime vergini',
      'Diminuzione dell\'impronta ecologica dei prodotti',
      'Riduzione degli impatti ambientali dell\'estrazione di risorse',
      'Preservazione delle risorse naturali non rinnovabili'
    ],
    negativeImpacts: [
      'Costi di implementazione di nuovi processi',
      'Investimenti in ricerca e sviluppo',
      'Limitazioni nella disponibilità di materiali alternativi',
      'Potenziali compromessi nella qualità dei prodotti'
    ],
    risks: [
      'Volatilità dei prezzi delle materie prime',
      'Interruzioni nella catena di approvvigionamento',
      'Dipendenza da risorse scarse o critiche',
      'Inefficienze nei processi produttivi'
    ],
    opportunities: [
      'Sviluppo di prodotti con materiali riciclati o rinnovabili',
      'Creazione di nuovi modelli di business circolari',
      'Riduzione dei costi attraverso l\'uso efficiente delle risorse',
      'Miglioramento della resilienza della catena di approvvigionamento'
    ],
    actions: [
      'Implementare strategie di approvvigionamento sostenibile',
      'Progettare prodotti per la durabilità e la riciclabilità',
      'Ottimizzare i processi per ridurre gli sprechi',
      'Collaborare con i fornitori per promuovere l\'economia circolare'
    ]
  },
  'resource-outflows': {
    positiveImpacts: [
      'Riduzione dei rifiuti',
      'Aumento del riciclo e del riutilizzo',
      'Diminuzione dell\'inquinamento',
      'Preservazione delle risorse naturali'
    ],
    negativeImpacts: [
      'Costi di implementazione di sistemi di gestione dei rifiuti',
      'Investimenti in tecnologie di riciclo',
      'Complessità logistica nella gestione dei flussi di materiali',
      'Potenziali limitazioni nella valorizzazione di alcuni materiali'
    ],
    risks: [
      'Aumento dei costi di smaltimento',
      'Sanzioni normative',
      'Danni reputazionali',
      'Perdita di valore dei materiali'
    ],
    opportunities: [
      'Creazione di nuovi mercati per i materiali riciclati',
      'Riduzione dei costi di smaltimento',
      'Miglioramento dell\'immagine aziendale',
      'Innovazione tecnologica'
    ],
    actions: [
      'Implementare sistemi di gestione dei rifiuti',
      'Promuovere il riciclo e il riutilizzo',
      'Progettare prodotti per la riciclabilità',
      'Collaborare con le aziende di riciclo'
    ]
  },
  'waste': {
    positiveImpacts: [
      'Riduzione della produzione di rifiuti',
      'Aumento del riciclo e del riutilizzo',
      'Diminuzione dell\'inquinamento',
      'Preservazione delle risorse naturali'
    ],
    negativeImpacts: [
      'Costi di implementazione di sistemi di riduzione dei rifiuti',
      'Investimenti in tecnologie e processi alternativi',
      'Complessità nella gestione di filiere produttive complesse',
      'Potenziali limitazioni nella varietà di prodotti offerti'
    ],
    risks: [
      'Aumento dei costi di smaltimento',
      'Sanzioni normative',
      'Danni reputazionali',
      'Perdita di valore dei materiali'
    ],
    opportunities: [
      'Creazione di nuovi mercati per i materiali riciclati',
      'Riduzione dei costi di smaltimento',
      'Miglioramento dell\'immagine aziendale',
      'Innovazione tecnologica'
    ],
    actions: [
      'Implementare sistemi di gestione dei rifiuti',
      'Promuovere il riciclo e il riutilizzo',
      'Progettare prodotti per la riciclabilità',
      'Collaborare con le aziende di riciclo'
    ]
  }
};
