
/**
 * Utility functions to filter materiality issues by ESRS theme
 */

/**
 * Filter issues based on the selected ESRS theme
 * @param issueId The ID of the issue to check
 * @param theme The selected ESRS theme
 * @returns Boolean indicating if the issue belongs to the selected theme
 */
export const issueMatchesTheme = (issueId: string, theme: string): boolean => {
  if (theme === 'all') return true;
  
  switch (theme) {
    case 'Cambiamenti climatici':
      return issueId.startsWith('climate') || issueId === 'energy';
    case 'Inquinamento':
      return issueId.startsWith('pollution') || issueId.includes('substances');
    case 'Acque e risorse marine':
      return issueId.startsWith('water') || issueId.includes('marine');
    case 'Biodiversità ed ecosistemi':
      return issueId.startsWith('biodiversity') || issueId.includes('soil') || issueId.includes('ecosystem') || issueId.includes('species');
    case 'Economia circolare':
      return issueId.startsWith('resource') || issueId === 'waste';
    case 'Forza lavoro propria':
      return issueId.startsWith('labor') && !issueId.includes('supply');
    case 'Lavoratori nella catena del valore':
      return issueId.startsWith('supply-labor');
    case 'Comunità interessate':
      return issueId.startsWith('community') || issueId.startsWith('indigenous');
    case 'Consumatori e utilizzatori finali':
      return issueId.startsWith('consumer');
    case 'Condotta delle imprese':
      return (
        issueId.startsWith('business') || 
        issueId === 'whistleblower-protection' || 
        issueId === 'animal-welfare' || 
        issueId === 'political-engagement' || 
        issueId === 'supplier-relations' ||
        issueId.includes('corruption')
      );
    default:
      return false;
  }
};
