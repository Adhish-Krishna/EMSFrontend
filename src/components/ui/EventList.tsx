import React from 'react';
import EventCard from '../ClubComponents/IndividualEventCard';

export interface Event {
    id: number;
    name: string;
    about: string;
    date: string;
    event_type: string;
    venue: string;
    event_category: string;
    min_no_member: number;
    max_no_member: number;
    chief_guest?: string;
    exp_expense?: number;
    tot_amt_allot_su?: number;
    tot_amt_spt_dor?: number;
    exp_no_aud?: number;
    faculty_obs_desig?: string;
    faculty_obs_dept?: string;
    poster?: string;
  }
  

interface EventListProps {
  events: Event[];
  event_type : 'ongoing' | 'upcoming' | 'past'
}

const EventList: React.FC<EventListProps> = ({ events,event_type }) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-black/30 rounded-lg text-center">
        <p className="text-gray-400 text-lg mb-2">No events found</p>
        <p className="text-gray-500">Try changing your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event}
          event_type = {event_type}
        />
      ))}
    </div>
  );
};

export default EventList;