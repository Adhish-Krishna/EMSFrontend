import React from 'react';
import Pointer from '../ui/Pointer';
import { Calendar, MapPin, Users } from 'lucide-react';
import { FollowerPointerCard } from '../ui/FollowingPointer';
import { useNavigate } from 'react-router-dom';


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
  

interface EventCardProps {
  event: Event;
  event_type : 'past' | 'upcoming' | 'ongoing'
}

const EventCard: React.FC<EventCardProps> = ({ event,event_type }) => {
  const navigate = useNavigate()
  return (
  <FollowerPointerCard title={ <p>{event.name}</p> } className='max-h-[500px] mb-3'>
    <div 
  className="group relative rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl h-full"
  onClick={() => navigate(`/club/events/${event.id}?type=${event_type}`)} 
>
  <div className="relative h-[60%]  bg-gray-800 flex items-center justify-center overflow-hidden">
    {event.poster ? (
      <>
      <div className='overflow-hidden rounded-2xl'><img 
        src={event.poster} 
        alt={event.name}
        className="w-full h-full rounded-2xl object-cover opacity-90 group-hover:opacity-80 transition-opacity duration-300"
      /></div>
      
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 rounded-full text-xs bg-black/50 text-emerald-300 border border-emerald-500/30">
          {event.event_type}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent"></div>
    </>
    ) : (
      <>
        <div className="text-gray-200 text-sm">No Poster Available</div>
        
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs bg-black/50 text-emerald-300 border border-emerald-500/30">
            {event.event_type}
          </span>
        </div>
      </>
    )}
  </div>

  {/* Event Details Section */}
  <div className="relative z-10 p-6 flex flex-col h-[40%]">
    <div className="mb-2">
      <Pointer text={event.name} />
    </div>
    
    <p className="text-gray-300 mb-2 line-clamp-2">{event.about}</p>
    
    <div className="space-y-3 text-sm text-gray-400">
      <div className="flex items-center">
        <Calendar size={16} className="mr-2 text-emerald-400" />
        <span>{new Date(event.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}</span>
      </div>
      
      <div className="flex items-center">
        <MapPin size={16} className="mr-2 text-emerald-400" />
        <span>{event.venue}</span>
      </div>
      
      <div className="flex items-center mb-3">
        <Users size={16} className="mr-2 text-emerald-400" />
        <span>{event.min_no_member} - {event.max_no_member} members</span>
      </div>
    </div>
    
    {/* View Details button */}
    <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 cursor-none rounded transition-colors duration-200">
        View Details
      </button>
    </div>
  </div>
</div>
</FollowerPointerCard>
  );
};

export default EventCard;