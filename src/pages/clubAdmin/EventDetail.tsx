import React, { useState } from 'react';
import { 
  getTeamsByEventId, 
  getRegistrationsByEventId, 
  getTeamMembersByEventId, 
  getFeedbackByEventId, 
  getWinnersByEventId ,mockEvents
} from '../../data/mockData';
import { ArrowLeft, Calendar, MapPin, MessageCircle, Medal, UserCheck, Users } from 'lucide-react';
import Pointer from '../../components/ui/Pointer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSingleEvent } from '../../hooks/useEvents';

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
  console.log(event_type)
  
  const {data:event} = useSingleEvent({event_id:eventId})

  const event_id = event?.id;

const feedbacks = event_id ? getFeedbackByEventId(event_id) : [];
const teams = event_id ? getTeamsByEventId(event_id) : [];
const registrations = event_id ? getRegistrationsByEventId(event_id) : [];
const members = event_id ? getTeamMembersByEventId(event_id) : [];
const winners = event_id ? getWinnersByEventId(event_id) : [];

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
            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-emerald-400 mb-4">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm">About</h4>
                    <p className="text-white">{`${event?.about}`}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Venue</h4>
                    <p className="text-white">{`${event?.venue}`}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Category</h4>
                    <p className="text-white">{`${event?.event_category}`}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm">Team Size</h4>
                    <p className="text-white">{`${event?.min_no_member} - ${event?.max_no_member} members`}</p>
                  </div>
                  {event?.chief_guest && (
                    <div>
                      <h4 className="text-gray-400 text-sm">Chief Guest</h4>
                      <p className="text-white">{`${event?.chief_guest}`}</p>
                    </div>
                  )}
                  {event?.faculty_obs_desig && (
                    <div>
                      <h4 className="text-gray-400 text-sm">Faculty Observer</h4>
                      <p className="text-white">{event.faculty_obs_desig} - {event.faculty_obs_dept}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {event?.exp_expense && (
              <div className="bg-black/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Budget Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-900/20 rounded-lg">
                    <h4 className="text-gray-400 text-sm mb-2">Expected Expense</h4>
                    <p className="text-2xl text-emerald-400">₹{event.exp_expense}</p>
                  </div>
                  <div className="p-4 bg-emerald-900/20 rounded-lg">
                    <h4 className="text-gray-400 text-sm mb-2">SU Allocation</h4>
                    <p className="text-2xl text-emerald-400">₹{event.tot_amt_allot_su}</p>
                  </div>
                  <div className="p-4 bg-emerald-900/20 rounded-lg">
                    <h4 className="text-gray-400 text-sm mb-2">DOR Support</h4>
                    <p className="text-2xl text-emerald-400">₹{event.tot_amt_spt_dor}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'feedback':
        return (
          <div className="space-y-6">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-medium">{feedback.user?.name}</h3>
                      <p className="text-gray-400 text-sm">{new Date(feedback.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-lg ${i < feedback.rating ? 'text-emerald-400' : 'text-gray-600'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{feedback.feedback}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">No feedback available for this event</div>
            )}
          </div>
        );
      
      case 'registrations':
        return (
          <div className="space-y-4">
            {registrations.length > 0 ? (
              registrations.map((registration) => {
                const team = teams.find(t => t.id === registration.team_id);
                const teamMembers = members.filter(m => m.team_id === registration.team_id);
                
                return (
                  <div key={registration.id} className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-emerald-300 font-medium mb-2">{team?.name}</h3>
                    <p className="text-gray-400 mb-3">Team ID: {team?.id}</p>
                    <div className="space-y-2">
                      <h4 className="text-gray-300 font-medium">Team Members:</h4>
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></div>
                          <span className="text-gray-300">{member.user?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">No registrations available for this event</div>
            )}
          </div>
        );
      
      case 'attendance':
        return (
          <div>
            <div className="mb-4 p-4 bg-black/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">Attendance Summary</h3>
                <span className="text-emerald-400 font-medium">
                  {members.filter(m => m.is_present).length}/{members.length} Present
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-emerald-400 h-2 rounded-full" 
                  style={{ width: `${members.length > 0 ? (members.filter(m => m.is_present).length / members.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-4">
              {teams.map((team) => {
                const teamMembers = members.filter(m => m.team_id === team.id);
                
                return (
                  <div key={team.id} className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-emerald-300 font-medium mb-3">{team.name}</h3>
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex justify-between items-center py-1 border-b border-gray-700">
                          <span className="text-gray-300">{member.user?.name}</span>
                          <span className={`px-2 py-1 rounded text-xs ${member.is_present ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                            {member.is_present ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 'winners':
        return (
          <div className="space-y-6">
            {winners.length > 0 ? (
              winners.sort((a, b) => a.position - b.position).map((winner) => {
                const team = teams.find(t => t.id === winner.team_id);
                const position = winner.position;
                
                return (
                  <div key={winner.id} className={`p-6 rounded-lg border ${position === 1 ? 'border-yellow-500 bg-yellow-900/20' : position === 2 ? 'border-gray-400 bg-gray-700/20' : 'border-amber-700 bg-amber-900/20'}`}>
                    <div className="flex items-center mb-3">
                      <span className={`text-3xl mr-3 ${position === 1 ? 'text-yellow-500' : position === 2 ? 'text-gray-400' : 'text-amber-700'}`}>
                        {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
                      </span>
                      <h3 className={`text-xl font-bold ${position === 1 ? 'text-yellow-300' : position === 2 ? 'text-gray-300' : 'text-amber-400'}`}>
                        {position === 1 ? 'First Place' : position === 2 ? 'Second Place' : 'Third Place'}
                      </h3>
                    </div>
                    <div className="ml-12">
                      <h4 className="text-white text-lg font-medium mb-1">{team?.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {members.filter(m => m.team_id === winner.team_id).map((member) => (
                          <span key={member.id} className="px-3 py-1 bg-black/30 rounded-full text-gray-300 text-sm">
                            {member.user?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">No winners announced for this event yet</div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div style={{marginTop:80}} className="relative min-h-screen bg-black text-white overflow-hidden rounded-xl">
      <div 
        className="relative pt-10 flex flex-row px-3 gap-x-2" 
        style={{ 
          backgroundImage: event?.poster ? `url(${event.poster})` : 'linear-gradient(to right, #065f46, #000000)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        
        {/* Back button */}
        <button 
        onClick={() => navigate('/club/events')}
        className="z-10 flex items-center gap-2 px-4 py-2 max-h-10
        rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white 
        font-medium shadow-md hover:shadow-lg hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300">
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
              <p className="text-gray-300 mt-2 max-w-2xl">{`${event?.about}`}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-emerald-400" />
                <span className="text-gray-300">
                  {new Date(`${event?.date}`).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-emerald-400" />
                <span className="text-gray-300">{`${event?.venue}`}</span>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-900/50 text-emerald-300 border border-emerald-500/30">
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
              className={`flex items-center gap-2 px-4 py-3 mx-1 rounded-t-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tab content */}
        <div className="bg-gray-900/50 rounded-lg p-6 mt-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;