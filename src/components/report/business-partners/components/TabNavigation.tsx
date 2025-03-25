
import React from 'react';
import { Tab } from '@headlessui/react';
import { classNames } from '@/lib/utils';

export interface TabDefinition {
  id: string;
  name: string;
}

interface TabNavigationProps {
  tabs: TabDefinition[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  selectedIndex,
  onChange
}) => {
  return (
    <Tab.List className="flex space-x-1 overflow-x-auto pb-2 border-b border-gray-200">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          className={({ selected }) =>
            classNames(
              'px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap',
              selected
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            )
          }
        >
          {tab.name}
        </Tab>
      ))}
    </Tab.List>
  );
};
