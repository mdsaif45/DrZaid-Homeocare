import React, { useState } from 'react';
import { cn } from '../../lib/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId, className }) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex border-b border-border space-x-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center space-x-2 border-b-2 px-4 py-2.5 text-sm font-medium cursor-pointer',
                isActive
                  ? 'border-primary text-primary-text'
                  : 'border-transparent text-text-muted hover:border-border-strong hover:text-text'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="pt-4">{activeContent}</div>
    </div>
  );
};
