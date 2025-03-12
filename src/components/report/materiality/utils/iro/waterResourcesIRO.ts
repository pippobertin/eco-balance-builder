
import { IROData } from '../../types';

// Water and marine resources related IRO data
export const waterResourcesIROData: Record<string, IROData> = {
  'water-consumption': {
    positiveImpacts: [
      'Riduzione del consumo idrico',
      'Preservazione delle risorse idriche',
      'Miglioramento dell\'efficienza idrica',
      'Diminuzione dell\'impatto ambientale'
    ],
    negativeImpacts: [
      'Costi di implementazione di sistemi efficienti',
      'Potenziale riduzione della produttività a breve termine',
      'Necessità di formazione del personale',
      'Spese di monitoraggio e manutenzione'
    ],
    risks: [
      'Aumento dei costi dell\'acqua',
      'Restrizioni sull\'uso dell\'acqua',
      'Interruzioni nella fornitura di acqua',
      'Danni reputazionali'
    ],
    opportunities: [
      'Riduzione dei costi attraverso l\'efficienza idrica',
      'Accesso a incentivi per la gestione sostenibile dell\'acqua',
      'Miglioramento della resilienza idrica',
      'Creazione di nuovi prodotti e servizi per la gestione dell\'acqua'
    ],
    actions: [
      'Misurare e ridurre il consumo idrico',
      'Utilizzare tecnologie efficienti',
      'Riciclare e riutilizzare l\'acqua',
      'Gestire le acque meteoriche'
    ]
  },
  'water-withdrawal': {
    positiveImpacts: [
      'Gestione sostenibile dei prelievi idrici',
      'Protezione degli ecosistemi acquatici',
      'Miglioramento della disponibilità di acqua',
      'Diminuzione dell\'impatto ambientale'
    ],
    negativeImpacts: [
      'Limitazioni ai prelievi idrici',
      'Investimenti in infrastrutture alternative',
      'Costi di monitoraggio e reporting',
      'Potenziali conflitti con altri utilizzatori'
    ],
    risks: [
      'Aumento dei costi di prelievo',
      'Restrizioni sui prelievi idrici',
      'Interruzioni nella fornitura di acqua',
      'Danni reputazionali'
    ],
    opportunities: [
      'Riduzione dei costi attraverso la gestione efficiente',
      'Accesso a incentivi per la gestione sostenibile dell\'acqua',
      'Miglioramento della resilienza idrica',
      'Creazione di nuovi prodotti e servizi per la gestione dell\'acqua'
    ],
    actions: [
      'Misurare e gestire i prelievi idrici',
      'Utilizzare tecnologie efficienti',
      'Rispettare i limiti di prelievo',
      'Collaborare con le autorità locali'
    ]
  },
  'water-discharge': {
    positiveImpacts: [
      'Riduzione dell\'inquinamento idrico',
      'Protezione degli ecosistemi acquatici',
      'Miglioramento della qualità dell\'acqua',
      'Diminuzione dell\'impatto ambientale'
    ],
    negativeImpacts: [
      'Costi di trattamento delle acque reflue',
      'Investimenti in tecnologie di depurazione',
      'Spese di monitoraggio e reporting',
      'Potenziali limitazioni operative'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di depurazione',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di depurazione',
      'Innovazione tecnologica'
    ],
    actions: [
      'Monitorare gli scarichi idrici',
      'Utilizzare tecnologie di depurazione',
      'Ridurre l\'uso di sostanze inquinanti',
      'Compensare gli scarichi residui'
    ]
  },
  'ocean-discharge': {
    positiveImpacts: [
      'Protezione degli ecosistemi marini',
      'Riduzione dell\'inquinamento degli oceani',
      'Miglioramento della qualità dell\'acqua marina',
      'Diminuzione dell\'impatto ambientale'
    ],
    negativeImpacts: [
      'Costi di implementazione di sistemi di trattamento',
      'Investimenti in tecnologie marine specializzate',
      'Limitazioni alle operazioni marittime',
      'Complessità normativa internazionale'
    ],
    risks: [
      'Sanzioni normative',
      'Danni reputazionali',
      'Aumento dei costi di depurazione',
      'Perdita di produttività'
    ],
    opportunities: [
      'Miglioramento dell\'immagine aziendale',
      'Attrazione di investitori socialmente responsabili',
      'Riduzione dei costi di depurazione',
      'Innovazione tecnologica'
    ],
    actions: [
      'Monitorare gli scarichi negli oceani',
      'Utilizzare tecnologie di depurazione avanzate',
      'Ridurre l\'uso di sostanze inquinanti',
      'Compensare gli scarichi residui'
    ]
  },
  'marine-resources': {
    positiveImpacts: [
      'Utilizzo sostenibile delle risorse marine',
      'Protezione della biodiversità marina',
      'Miglioramento della gestione delle risorse',
      'Diminuzione dell\'impatto ambientale'
    ],
    negativeImpacts: [
      'Limitazioni all\'accesso alle risorse marine',
      'Costi di implementazione di pratiche sostenibili',
      'Restrizioni sulle attività di pesca',
      'Complessità normativa internazionale'
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
      'Gestire in modo sostenibile le attività di pesca',
      'Proteggere gli habitat marini',
      'Ridurre l\'inquinamento marino',
      'Promuovere la ricerca scientifica'
    ]
  }
};
