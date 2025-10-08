import React from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className={cn('flex-1 flex flex-col overflow-hidden', className)}>
        <div className="flex-1 overflow-auto">
          <div className="container w-full p-6 lg:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
};
