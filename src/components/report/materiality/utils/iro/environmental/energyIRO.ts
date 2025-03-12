
import { IROData } from '../../../types';

export const energyIROData: Record<string, IROData> = {
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
  }
};
