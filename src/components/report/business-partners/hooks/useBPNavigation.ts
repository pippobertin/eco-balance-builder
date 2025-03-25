
import { useState, useRef, RefObject } from 'react';

interface BPRefs {
  bp1: RefObject<HTMLDivElement>;
  bp2: RefObject<HTMLDivElement>;
  bp3: RefObject<HTMLDivElement>;
  bp4: RefObject<HTMLDivElement>;
  bp5: RefObject<HTMLDivElement>;
  bp6: RefObject<HTMLDivElement>;
  bp7: RefObject<HTMLDivElement>;
  bp8: RefObject<HTMLDivElement>;
  bp9: RefObject<HTMLDivElement>;
  bp10: RefObject<HTMLDivElement>;
  bp11: RefObject<HTMLDivElement>;
}

export const useBPNavigation = (initialTab?: string) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab || 'bp1');
  
  // Riferimenti per la navigazione
  const refs: BPRefs = {
    bp1: useRef<HTMLDivElement>(null),
    bp2: useRef<HTMLDivElement>(null),
    bp3: useRef<HTMLDivElement>(null),
    bp4: useRef<HTMLDivElement>(null),
    bp5: useRef<HTMLDivElement>(null),
    bp6: useRef<HTMLDivElement>(null),
    bp7: useRef<HTMLDivElement>(null),
    bp8: useRef<HTMLDivElement>(null),
    bp9: useRef<HTMLDivElement>(null),
    bp10: useRef<HTMLDivElement>(null),
    bp11: useRef<HTMLDivElement>(null)
  };
  
  // Funzione per navigare a una sezione specifica
  const navigateTo = (tabId: string) => {
    setActiveTab(tabId);
    
    // Scroll to the selected section
    const refKey = tabId as keyof BPRefs;
    if (refs[refKey]?.current) {
      refs[refKey].current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  return {
    activeTab,
    refs,
    navigateTo
  };
};
