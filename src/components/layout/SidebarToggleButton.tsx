'use client';

import { useSidebar } from './SidebarContext';

interface SidebarToggleButtonProps {
  onClick?: () => void;
}

export default function SidebarToggleButton({ onClick }: SidebarToggleButtonProps) {
  const { toggle } = useSidebar();
  
  // Use the provided onClick prop if available, otherwise use the toggle from context
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggle();
    }
  };
  
  return (
    <button 
      className="p-2 rounded-md bg-white shadow-sm text-gray-500 hover:text-blue-500 md:hidden"
      aria-label="Toggle sidebar"
      onClick={handleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
