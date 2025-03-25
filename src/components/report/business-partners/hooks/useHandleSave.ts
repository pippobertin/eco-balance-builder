
// Utility hook per trasformare una funzione che ritorna Promise<boolean> in una che ritorna Promise<void>
export const useHandleSave = (saveFunction: () => Promise<boolean>) => {
  const handleSave = async (): Promise<void> => {
    try {
      await saveFunction();
      // Non ritorniamo nulla, quindi TypeScript considererà questa funzione come Promise<void>
    } catch (error) {
      console.error("Error in handleSave:", error);
      // Still returns void
    }
  };
  
  return handleSave;
};
