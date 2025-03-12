export * from './stakeholderUtils';
export * from './surveyUtils';
export * from './predefinedIssues';
export * from './iroData';
export * from './esgCategoryUtils';

// List of theme headers that should not be selectable
const themeHeaders = [
  'climate-change',
  'pollution',
  'water-marine',
  'biodiversity',
  'circular-economy',
  'own-workforce',
  'value-chain-workers',
  'affected-communities',
  'consumers-end-users',
  'business-conduct'
];

export const isHeaderTheme = (id: string): boolean => {
  return themeHeaders.some(header => id.startsWith(header));
};
