import React from 'react';
import { TabType } from '../../pages/clubAdmin/EventsPage';
interface EventTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const EventTabs: React.FC<EventTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: TabType; label: string }[] = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'past', label: 'Past' },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-center items-center border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-3 text-center relative transition-all duration-200 ${
              activeTab === tab.key
                ? 'text-emerald-400 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-400 rounded-t-md transform transition-all duration-300"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventTabs;