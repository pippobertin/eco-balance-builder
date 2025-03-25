
import React from 'react';
import { Tab } from '@headlessui/react';

interface TabPanelContentProps {
  children: React.ReactNode;
}

export const TabPanelContent: React.FC<TabPanelContentProps> = ({
  children
}) => {
  return (
    <Tab.Panel>
      {children}
    </Tab.Panel>
  );
};
