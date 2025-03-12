
import { createContext, useContext } from 'react';
import { MaterialityContextType } from './types';

const MaterialityContext = createContext<MaterialityContextType | null>(null);

export const useMaterialityContext = () => {
  const context = useContext(MaterialityContext);
  if (!context) {
    throw new Error('useMaterialityContext must be used within a MaterialityProvider');
  }
  return context;
};

export default MaterialityContext;
