
// Utility function to translate ESG categories to Italian
export const translateESGCategory = (category: string): string => {
  switch (category) {
    case 'environmental':
      return 'Ambientale';
    case 'social':
      return 'Sociale';
    case 'governance':
      return 'Governance';
    default:
      return category;
  }
};

// Define the ESRS themes
export const esrsThemes = {
  environmental: [
    'Cambiamento climatico',
    'Inquinamento',
    'Acqua e risorse marine',
    'Biodiversità ed ecosistemi',
    'Uso delle risorse e economia circolare'
  ],
  social: [
    'Forza lavoro propria',
    'Lavoratori nella catena del valore',
    'Comunità interessate',
    'Consumatori e utenti finali'
  ],
  governance: [
    'Comportamento aziendale',
    'Governance e risk management',
    'Innovazione e R&S',
    'Etica aziendale e conformità'
  ]
};
