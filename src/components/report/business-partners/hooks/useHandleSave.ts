
// Utility hook per trasformare una funzione che ritorna Promise<boolean> in una che ritorna Promise<void>
export const useHandleSave = (saveFunction: () => Promise<boolean>) => {
  const handleSave = async (): Promise<void> => {
    await saveFunction();
    // Non ritorniamo nulla, quindi TypeScript considererà questa funzione come Promise<void>
  };
  
  return handleSave;
};
