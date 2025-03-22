
// Export all hooks but avoid duplicate type exports
export * from './useAntiCorruptionLoad';
export * from './useAntiCorruptionSave';
// Export the type only from types.ts to avoid duplication
export type { AntiCorruptionData } from './types';
// Export everything else from useAntiCorruptionData except the AntiCorruptionData type
export { useAntiCorruptionData } from './useAntiCorruptionData';
