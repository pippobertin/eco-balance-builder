
export * from './stakeholderUtils';
export * from './surveyUtils';
export * from './predefinedIssues';
export * from './iroData';
export * from './esgCategoryUtils';

// Lista dei temi principali che fungono da titoli e non devono essere selezionabili
const themeHeaders = [
  'climate-change-header',
  'pollution-header',
  'water-marine-header',
  'biodiversity-header',
  'circular-economy-header',
  'own-workforce-header',
  'value-chain-workers-header',
  'affected-communities-header',
  'consumers-end-users-header',
  'business-conduct-header'
];

export const isHeaderTheme = (id: string): boolean => {
  return themeHeaders.includes(id);
};
