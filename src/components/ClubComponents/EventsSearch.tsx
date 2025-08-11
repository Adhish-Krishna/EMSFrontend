import React from 'react';
import VanishInput from '../ui/VanishInput';
import { Search } from 'lucide-react';

interface EventSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const EventSearch: React.FC<EventSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className='flex items-center justify-center mb-3'>
      <div className="flex flex-row gap-x-4">
        <div className="text-blue-500 flex items-center justify-center">
          <Search className='max-h-10 w-full items-center justify-center' />
        </div>
        <VanishInput
          placeholder="Search Events"
          value={searchTerm}
          onChange={setSearchTerm}
          className='min-w-[300px] bg-white text-blue-900 placeholder-blue-400'
        />
      </div>
    </div>
  );
};

export default EventSearch;