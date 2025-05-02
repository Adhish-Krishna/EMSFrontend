import React, { useState } from 'react'
import { Team, TeamMember, useGetRegistrations } from '../../hooks/useEvents';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postData } from '../../utils/customFetch';
import { toast, ToastContainer } from 'react-toastify';

export default function EventRegistration({event_id,event_type}:
    {event_id:string | undefined,event_type : string | undefined}) 
{

  const { data: registrations } = useGetRegistrations({ event_id });
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMinimized, setIsModalMinimized] = useState(false);

  const queryclient = useQueryClient();

  const {mutate:PutAttendance} = useMutation({
    mutationFn:async () => {
        const requests = selectedMembers.map(member => 
          postData('admin/attendance', {
            user_id: member.id,
            event_id: Number(event_id),
            is_present: true
          })
        );
        return await Promise.all(requests);
    },
    onSuccess: () => {
      toast.success(`${selectedMembers.length} attendance records updated successfully!`, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark'
      });
      queryclient.invalidateQueries({
        type:"all",
        queryKey:["eventRegistrations",event_id],
        exact:false,
        predicate:(query) => query.queryKey[0] === 'eventRegistrations'
      })
      setSelectedMembers([]);
      setIsModalOpen(false);
      setIsModalMinimized(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update attendance: ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'dark'
      });
    }
  })
  
  const toggleMemberSelection = (member: TeamMember) => {
    setSelectedMembers(prev => 
      prev.some(m => m.rollno === member.rollno)
        ? prev.filter(m => m.rollno !== member.rollno)
        : [...prev, member]
    );
  };
  
  const handleMinimizeModal = () => {
    setIsModalMinimized(true);
    setIsModalOpen(false);
  };
  
  const expandModal = () => {
    setIsModalMinimized(false);
    setIsModalOpen(true);
  };
  
  const confirmAttendance = () => {
    if (selectedMembers.length === 0) {
        toast.warn('No members selected for attendance!', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark'
        });
        return;
      }
    
    PutAttendance();
  };

  if(registrations === undefined) {
    return (
        <div className="flex justify-center items-center h-screen w-screen bg-black">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        )
    }
  return (
    <div className="space-y-8 relative px-4 sm:px-6 lg:px-8">
    {isModalMinimized && (
        <div 
          onClick={expandModal}
          className="fixed top-4 right-4 z-50 bg-gradient-to-br from-neutral-900 to-black p-4 rounded-xl shadow-2xl border border-emerald-900/50 cursor-pointer transition-all hover:scale-105 animate-fade-in w-64"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="text-emerald-300 font-semibold">
              {selectedMembers.length} Selected
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedMembers.map(member => (
              <div key={member.rollno} className="flex items-center gap-2 p-2 bg-neutral-800/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-sm text-gray-200 truncate">{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Modal */}
    {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-neutral-900 to-black text-white rounded-3xl p-8 w-[95%] max-w-lg shadow-2xl border border-neutral-700/50 animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Select Attendees
              </h2>
              <button
                onClick={handleMinimizeModal}
                className="bg-neutral-800/50 hover:bg-neutral-700/50 text-gray-300 px-3 py-1 rounded-lg transition-all flex items-center gap-2 text-sm"
              >
                Minimize
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {registrations?.flatMap(({ members }) => members).map((member) => (
                <div
                  key={member.rollno}
                  onClick={() => toggleMemberSelection(member)}
                  className={`group bg-neutral-800/30 p-4 rounded-xl cursor-pointer transition-all
                    ${selectedMembers.some(m => m.rollno === member.rollno) 
                      ? 'border-2 border-emerald-500/50' 
                      : 'border border-neutral-700/50 hover:border-emerald-900/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${selectedMembers.some(m => m.rollno === member.rollno)
                          ? 'bg-emerald-500 border-emerald-600'
                          : 'bg-neutral-700/50 border-neutral-600'}`}
                      >
                        {selectedMembers.some(m => m.rollno === member.rollno) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{member.name}</p>
                        <p className="text-emerald-400/80 text-sm">{member.rollno}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">{member.department}</p>
                      <p className="text-sm text-gray-300">Year {member.yearofstudy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {selectedMembers.length} members selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedMembers([]);
                    setIsModalOpen(false);
                    setIsModalMinimized(false);
                  }}
                  className="bg-neutral-800/50 hover:bg-neutral-700/50 text-gray-300 px-4 py-2 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAttendance}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Confirm ({selectedMembers.length})
                </button>
              </div>
            </div>
          </div>
        </div>
    )}
    {registrations.length > 0 ? (
        registrations.map(({ team_id, team_name, members }: Team) => (
          <div
            key={team_id}
            className="group bg-gradient-to-br from-black/40 to-neutral-900/50 p-6 rounded-2xl shadow-2xl relative border border-emerald-900/30 hover:border-emerald-900/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 className="text-emerald-300 text-2xl font-bold mb-5 tracking-wide flex items-center gap-2">
              <span className=" px-3 py-1 rounded-lg">{team_name}</span>
            </h3>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`bg-neutral-800/40 backdrop-blur-sm p-4 rounded-xl flex justify-between transition-all duration-200 border 
                    flex-col md:flex-row md:items-center  hover:bg-neutral-700/30  border-neutral-700/50 hover:border-emerald-900/50${
                    selectedMembers.some(m => m.rollno === member.rollno)
                      ? 'border-emerald-500/60 bg-emerald-900/20' // Active state
                      : 'border-neutral-700/50 hover:border-emerald-900/50' // Default state
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{member.name}</p>
                      <p className="text-emerald-400/80 font-mono text-sm">{member.rollno}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mt-3 md:mt-0">
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-200/80">
                        {member.department} • Year {member.yearofstudy}
                      </p>
                    </div>
                    {event_type !== 'upcoming' && !member.is_present && <button
                      onClick={() => {
                        toggleMemberSelection(member);
                        setIsModalOpen(true);
                      }}
                      className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-5 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-900/40 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Mark Attendance
                    </button> } 
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-2xl text-emerald-200/80 font-light">No registrations yet</p>
          <p className="text-gray-400 mt-2">Check back later for updates</p>
        </div>
      )}

       <ToastContainer theme='dark'/> 
     
    </div>
  )
}
