import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, MessageCircle, Medal, UserCheck, Users } from 'lucide-react';
import Pointer from '../../components/ui/Pointer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSingleEvent } from '../../hooks/useEvents';
import Feedback from '../../components/ClubComponents/EventFeedback';
import EventRegistration from '../../components/ClubComponents/EventRegistration';
import EventAttendance from '../../components/ClubComponents/EventAttendance';
import EventWinners from '../../components/ClubComponents/EventWinners';

type DetailTab = 'overview' | 'feedback' | 'registrations' | 'attendance' | 'winners';

function useQueryParams() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const EventDetail = () => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const {eventId} = useParams()
  const navigate = useNavigate()

  const query = useQueryParams()
  const event_type = query.get("type")
  
  const {data:event} = useSingleEvent({event_id:eventId})

  const event_id = event?.id;

  const detailTabs = [
    { key: 'overview', label: 'Overview', icon: <Users size={18} /> },
    { key: 'feedback', label: 'Feedback', icon: <MessageCircle size={18} /> },
    { key: 'registrations', label: 'Registrations', icon: <Users size={18} /> },
    { key: 'attendance', label: 'Attendance', icon: <UserCheck size={18} /> },
    { key: 'winners', label: 'Winners', icon: <Medal size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[10px] shadow border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-600 text-sm">About</h4>
                    <p className="text-gray-800">{`${event?.about}`}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm">Venue</h4>
                    <p className="text-gray-800">{`${event?.venue}`}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm">Category</h4>
                    <p className="text-gray-800">{`${event?.event_category}`}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-600 text-sm">Team Size</h4>
                    <p className="text-gray-800">{`${event?.min_no_member} - ${event?.max_no_member} members`}</p>
                  </div>
                  {event?.chief_guest && (
                    <div>
                      <h4 className="text-gray-600 text-sm">Chief Guest</h4>
                      <p className="text-gray-800">{`${event?.chief_guest}`}</p>
                    </div>
                  )}
                  {event?.faculty_obs_desig && (
                    <div>
                      <h4 className="text-gray-600 text-sm">Faculty Observer</h4>
                      <p className="text-gray-800">{event.faculty_obs_desig} - {event.faculty_obs_dept}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {event?.exp_expense && (
              <div className="bg-white p-6 rounded-[10px] shadow border border-gray-200">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Budget Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-[10px] border border-blue-100">
                    <h4 className="text-gray-600 text-sm mb-2">Expected Expense</h4>
                    <p className="text-2xl text-blue-600">₹{event.exp_expense}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-[10px] border border-blue-100">
                    <h4 className="text-gray-600 text-sm mb-2">SU Allocation</h4>
                    <p className="text-2xl text-blue-600">₹{event.tot_amt_allot_su}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-[10px] border border-blue-100">
                    <h4 className="text-gray-600 text-sm mb-2">DOR Support</h4>
                    <p className="text-2xl text-blue-600">₹{event.tot_amt_spt_dor}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'feedback':
        if(event_type === 'upcoming') {
          return (<div className="flex items-center justify-center h-full text-gray-500 text-lg bg-white p-6 rounded-[10px] shadow border border-gray-200">
            Feedback is not available for upcoming events.
          </div>)
        }
        return <Feedback event_id = {eventId} />
      
      case 'registrations':
        return (
          <EventRegistration event_id={eventId} event_type={event_type ?? undefined}/>
        );
      
      case 'attendance':
        if(event_type === 'upcoming') {
          return (<div className="flex items-center justify-center h-full text-gray-500 text-lg bg-white p-6 rounded-[10px] shadow border border-gray-200">
            Attendance is not available for upcoming events.
          </div>)
        }
        return  <EventAttendance event_id={eventId}/>
      
      case 'winners':
        if(event_type === 'upcoming') {
          return (<div className="flex items-center justify-center h-full text-gray-500 text-lg bg-white p-6 rounded-[10px] shadow border border-gray-200">
            Winners is not available for upcoming events.
          </div>)
        }
        return (
          <EventWinners event_id={eventId}/>
        );
        
      default:
        return null;
    }
  };

  return (
    <div style={{marginTop:80}} className="relative min-h-screen bg-slate-50 text-black overflow-hidden">
      <div 
        className="relative pt-10 flex flex-row px-3 gap-x-2"
        style={{ 
          backgroundImage: event?.poster ? `url(${event.poster})` : 'linear-gradient(to right, #3b82f6, #60a5fa)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '200px'
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent"></div>
        
        {/* Back button */}
        <button 
          onClick={() => navigate('/club/events')}
          className="z-10 flex items-center gap-2 px-4 py-2 max-h-10 rounded-[10px] bg-blue-600 text-white font-medium shadow hover:bg-opacity-80 active:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Event info */}
        <div className="relative w-full z-10 container mx-auto px-4 pb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="mb-2">
                <Pointer text={`${event?.name}`} className="inline-block" />
              </div>
              <p className="text-black mt-2 max-w-2xl">{`${event?.about}`}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-blue-600" />
                <span className="text-black">
                  {new Date(`${event?.date}`).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-blue-600" />
                <span className="text-black">{`${event?.venue}`}</span>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600 border border-blue-200">
                  {`${event?.event_type}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs navigation */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex justify-center md:justify-start overflow-x-auto pb-2">
          {detailTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as DetailTab)}
              className={`flex items-center gap-2 px-4 py-3 mx-1 rounded-t-[10px] transition-all duration-200 ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tab content */}
        <div className="bg-white rounded-[10px] shadow p-6 mt-1 border border-gray-200">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;