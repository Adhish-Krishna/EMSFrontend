import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, MessageCircle, Medal, UserCheck, Users } from 'lucide-react';
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
  const { eventId } = useParams();
  const navigate = useNavigate();
  const query = useQueryParams();
  const event_type = query.get("type");
  const { data: event } = useSingleEvent({ event_id: eventId });

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
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-md bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/20 transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-white mb-5 border-b border-white/10 pb-3 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full"></div>
                  Event Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-gray-300 text-sm font-medium mb-1">About</h4>
                    <p className="text-gray-100 leading-relaxed">{`${event?.about}`}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <h4 className="text-gray-300 text-sm font-medium mb-1">Venue</h4>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-teal-400" />
                        <p className="text-gray-100">{`${event?.venue}`}</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <h4 className="text-gray-300 text-sm font-medium mb-1">Category</h4>
                      <p className="text-gray-100">{`${event?.event_category}`}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-md bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/20 transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-white mb-5 border-b border-white/10 pb-3 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full"></div>
                  Team & Participants
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="group">
                    <h4 className="text-gray-300 text-sm font-medium mb-1">Team Size</h4>
                    <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 group-hover:shadow-md">
                      <p className="text-white text-lg">{`${event?.min_no_member} - ${event?.max_no_member} members`}</p>
                    </div>
                  </div>
                  
                  {event?.chief_guest && (
                    <div className="group">
                      <h4 className="text-gray-300 text-sm font-medium mb-1">Chief Guest</h4>
                      <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 group-hover:shadow-md">
                        <p className="text-white">{`${event?.chief_guest}`}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {event?.faculty_obs_desig && (
                  <div className="mt-5 group">
                    <h4 className="text-gray-300 text-sm font-medium mb-1">Faculty Observer</h4>
                    <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 group-hover:shadow-md">
                      <p className="text-white">{event.faculty_obs_desig} - {event.faculty_obs_dept}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {event?.exp_expense && (
              <div className="backdrop-blur-md bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/20">
                <h3 className="text-xl font-semibold text-white mb-5 border-b border-white/10 pb-3 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full"></div>
                  Budget Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="backdrop-blur-sm bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-gradient-to-br hover:from-neutral-800/80 hover:to-neutral-700/60 transition-all hover:shadow-lg group">
                    <h4 className="text-gray-300 text-sm mb-2 font-medium group-hover:text-teal-400 transition-colors">Expected Expense</h4>
                    <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                      ₹{event.exp_expense}
                    </p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-gradient-to-br hover:from-neutral-800/80 hover:to-neutral-700/60 transition-all hover:shadow-lg group">
                    <h4 className="text-gray-300 text-sm mb-2 font-medium group-hover:text-teal-400 transition-colors">SU Allocation</h4>
                    <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                      ₹{event.tot_amt_allot_su}
                    </p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-gradient-to-br hover:from-neutral-800/80 hover:to-neutral-700/60 transition-all hover:shadow-lg group sm:col-span-2 md:col-span-1">
                    <h4 className="text-gray-300 text-sm mb-2 font-medium group-hover:text-teal-400 transition-colors">DOR Support</h4>
                    <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                      ₹{event.tot_amt_spt_dor}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'feedback':
        if(event_type === 'upcoming') {
          return (
            <div className="flex flex-col items-center justify-center py-16 text-center backdrop-blur-md bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 rounded-2xl border border-white/10 hover:border-white/20 transition-all animate-fadeIn">
              <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Feedback Unavailable
              </h3>
              <p className="text-gray-300 max-w-md">
                Feedback will be available after the event has concluded
              </p>
            </div>
          )
        }
        return <Feedback event_id={eventId} />
      
      case 'registrations':
        return <EventRegistration event_id={eventId} event_type={event_type ?? undefined} />;
      
      case 'attendance':
        if(event_type === 'upcoming') {
          return (
            <div className="flex flex-col items-center justify-center py-16 text-center backdrop-blur-md bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 rounded-2xl border border-white/10 hover:border-white/20 transition-all animate-fadeIn">
              <UserCheck className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Attendance Unavailable
              </h3>
              <p className="text-gray-300 max-w-md">
                Attendance tracking will be available during the event
              </p>
            </div>
          )
        }
        return <EventAttendance event_id={eventId} />;
      
      case 'winners':
        if(event_type === 'upcoming') {
          return (
            <div className="flex flex-col items-center justify-center py-16 text-center backdrop-blur-md bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 rounded-2xl border border-white/10 hover:border-white/20 transition-all animate-fadeIn">
              <Medal className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Winners Unavailable
              </h3>
              <p className="text-gray-300 max-w-md">
                Winners will be announced after the event has concluded
              </p>
            </div>
          )
        }
        return <EventWinners event_id={eventId} />;
        
      default:
        return null;
    }
  };

  return (
    <div 
      style={{ marginTop: 80 }} 
      className="relative min-h-screen text-white overflow-hidden"
    >

      <div className="relative">
        <div className="backdrop-blur-xl bg-gradient-to-r from-neutral-950 via-black-100 to-neutral-800 border-b border-white/10 shadow-lg rounded-2xl">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
              <div className="w-full lg:w-auto">
                <button 
                  onClick={() => navigate('/club/events')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 mb-4 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-700 text-white font-medium hover:from-neutral-700 hover:to-neutral-600 transition-all duration-300 group shadow-md hover:shadow-lg"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to Events
                </button>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-shadow">
                  {`${event?.name}`}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-200 mt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-teal-400" />
                    <span>
                      {event?.date && new Date(`${event.date}`).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="hidden sm:block w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                  
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-teal-400" />
                    <span>{`${event?.venue}`}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 mt-2 lg:mt-0">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r to-neutral-800 from-neutral-700 text-white border border-white/20 shadow-md hover:shadow-lg transition-all hover:from-neutral-700 hover:to-neutral-600 hover:border-white/30">
                  {`${event?.event_type}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        {event?.poster && (
          <div 
            className="absolute inset-0 opacity-15"
            style={{ 
              backgroundImage: `url(${event.poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)',
            }}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-neutral-800"></div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="container mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="flex justify-start overflow-x-auto pb-2 scrollbar-hide">
          {detailTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as DetailTab)}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 mx-0.5 sm:mx-1 rounded-xl transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-neutral-800 to-neutral-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span className="font-medium text-sm sm:text-base">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="mt-5">
          {renderTabContent()}
        </div>
      </div>
      
      
    </div>
  );
};

export default EventDetail;