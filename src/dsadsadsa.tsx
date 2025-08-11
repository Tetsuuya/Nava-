import React from 'react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
    return (
        <aside className={`bg-[#F0F0F0] p-5 w-64 min-h-screen ${className}`}>
            <div className="flex flex-col gap-4">

            </div>
        </aside>
    );
}

export default Sidebar;