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
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/40 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm">About</h4>
                    <p className="text-gray-200">{`${event?.about}`}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Venue</h4>
                    <p className="text-gray-200">{`${event?.venue}`}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Category</h4>
                    <p className="text-gray-200">{`${event?.event_category}`}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm">Team Size</h4>
                    <p className="text-gray-200">{`${event?.min_no_member} - ${event?.max_no_member} members`}</p>
                  </div>
                  {event?.chief_guest && (
                    <div>
                      <h4 className="text-gray-400 text-sm">Chief Guest</h4>
                      <p className="text-gray-200">{`${event?.chief_guest}`}</p>
                    </div>
                  )}
                  {event?.faculty_obs_desig && (
                    <div>
                      <h4 className="text-gray-400 text-sm">Faculty Observer</h4>
                      <p className="text-gray-200">{event.faculty_obs_desig} - {event.faculty_obs_dept}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {event?.exp_expense && (
              <div className="bg-gradient-to-br from-gray-900/50 to-black/40 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
                  Budget Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/10 p-4 rounded-xl border border-emerald-900/30">
                    <h4 className="text-gray-400 text-sm mb-2">Expected Expense</h4>
                    <p className="text-2xl bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                      ₹{event.exp_expense}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/10 p-4 rounded-xl border border-emerald-900/30">
                    <h4 className="text-gray-400 text-sm mb-2">SU Allocation</h4>
                    <p className="text-2xl bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                      ₹{event.tot_amt_allot_su}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/10 p-4 rounded-xl border border-emerald-900/30">
                    <h4 className="text-gray-400 text-sm mb-2">DOR Support</h4>
                    <p className="text-2xl bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
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
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-br from-gray-900/50 to-black/40 rounded-2xl border border-gray-800">
              <MessageCircle className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Feedback Unavailable
              </h3>
              <p className="text-gray-500 max-w-md">
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
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-br from-gray-900/50 to-black/40 rounded-2xl border border-gray-800">
              <UserCheck className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Attendance Unavailable
              </h3>
              <p className="text-gray-500 max-w-md">
                Attendance tracking will be available during the event
              </p>
            </div>
          )
        }
        return <EventAttendance event_id={eventId} />;
      
      case 'winners':
        if(event_type === 'upcoming') {
          return (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-br from-gray-900/50 to-black/40 rounded-2xl border border-gray-800">
              <Medal className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Winners Unavailable
              </h3>
              <p className="text-gray-500 max-w-md">
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
      className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white overflow-hidden"
    >
      {/* Event Header with Gradient Overlay */}
      <div 
        className="relative pt-16 px-4 pb-12"
        style={{ 
          backgroundImage: event?.poster 
            ? `linear-gradient(to bottom, rgba(3, 15, 15, 0.85), rgba(4, 20, 20, 0.9)), url(${event.poster})`
            : 'linear-gradient(to right, #064e3b, #022c22)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Gradient Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent"></div>
        
        {/* Back Button */}
        <div className="container mx-auto relative z-10">
          <button 
            onClick={() => navigate('/club/events')}
            className="flex items-center gap-2 px-4 py-2.5 max-h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-medium shadow-lg hover:shadow-emerald-900/40 hover:scale-105 transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Events
          </button>
        </div>
      </div>
      
      {/* Event Info Card */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-gradient-to-br from-gray-900/70 to-black/60 backdrop-blur-sm rounded-2xl border border-emerald-900/30 shadow-xl shadow-emerald-900/10 p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="mb-3">
                <Pointer 
                  text={`${event?.name}`} 
                  className="inline-block text-2xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent" 
                />
              </div>
              <p className="text-gray-300 mt-2 max-w-2xl">{`${event?.about}`}</p>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-900/20 p-2 rounded-lg">
                  <Calendar size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-gray-200">
                    {new Date(`${event?.date}`).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="bg-emerald-900/20 p-2 rounded-lg">
                  <MapPin size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Venue</p>
                  <p className="text-gray-200">{`${event?.venue}`}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-900/30 to-teal-900/20 text-emerald-300 border border-emerald-500/30">
                  {`${event?.event_type}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex justify-center md:justify-start overflow-x-auto pb-2">
          {detailTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as DetailTab)}
              className={`flex items-center gap-2 px-5 py-3 mx-1 rounded-xl transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/30 text-emerald-300 shadow-lg shadow-emerald-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="bg-gradient-to-br from-gray-900/50 to-black/40 rounded-2xl border border-gray-800 p-6 mt-5 shadow-lg shadow-black/30">
          {renderTabContent()}
        </div>
      </div>
      
      {/* Floating Gradient Elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-emerald-900/10 to-teal-900/5 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none"></div>
    </div>
  );
};

export default EventDetail;