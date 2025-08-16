import React, { useState, useEffect, useMemo } from 'react';
import { Team, TeamMember, useGetRegistrations } from '../../hooks/useEvents';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postData } from '../../utils/customFetch';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';

import { Download, Search, List, Table, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function EventRegistration({event_id, event_type}:
    {event_id:string | undefined, event_type : string | undefined}) 
{
  const { data: registrations, isLoading, error } = useGetRegistrations({ event_id });
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMinimized, setIsModalMinimized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const queryclient = useQueryClient();

  const filteredRegistrations = useMemo(() => {
    if (!registrations || !searchQuery.trim()) return registrations;
    
    return registrations.filter(team => {
      if (team.team_name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
      
      return team.members.some(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.rollno.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [registrations, searchQuery]);

  // Flatten all members for table view
  const allMembers = useMemo(() => {
    if (!filteredRegistrations) return [];
    
    return filteredRegistrations.flatMap(team => 
      team.members.map(member => ({
        ...member,
        team_name: team.team_name,
        team_id: team.team_id
      }))
    );
  }, [filteredRegistrations]);
  
  const sortedMembers = useMemo(() => {
    if (!sortConfig) return allMembers;
    
    return [...allMembers].sort((a, b) => {
      if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [allMembers, sortConfig]);

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
  });
  
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

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp size={16} className="inline-block ml-1 text-emerald-400" /> : 
      <ChevronDown size={16} className="inline-block ml-1 text-emerald-400" />;
  };

  const downloadExcel = () => {
    if (!registrations || registrations.length === 0) {
      toast.warn('No registration data to download', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark'
      });
      return;
    }

    const exportData = registrations.flatMap(team => 
      team.members.map(member => ({
        'Team Name': team.team_name,
        'Student Name': member.name,
        'Roll Number': member.rollno,
        'Department': member.department,
        'Year of Study': member.yearofstudy,
        'Status': member.is_present ? 'Present' : 'Absent',
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    
    // Format columns to proper width
    const maxWidth = exportData.reduce((w, r) => Math.max(w, r['Student Name'].length, r['Team Name'].length), 10);
    const colWidth = Math.max(10, Math.min(maxWidth, 20));
    
    worksheet['!cols'] = [
      { wch: colWidth },  // Team Name
      { wch: colWidth },  // Student Name
      { wch: 15 },        // Roll Number
      { wch: 15 },        // Department
      { wch: 5 },         // Year
      { wch: 8 },         // Status
      { wch: 25 },        // Email
      { wch: 15 },        // Phone
    ];

    // Generate a filename
    const now = new Date();
    const filename = `event_registrations_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}.xlsx`;
    
    // Create & download the file
    XLSX.writeFile(workbook, filename);
    
    toast.success('Registration data downloaded successfully', {
      position: 'top-right',
      autoClose: 3000,
      theme: 'dark'
    });
  };

  if(isLoading) {
    return (
      <div className="flex justify-center items-center py-16 backdrop-blur-md bg-black/20 rounded-2xl border border-neutral-800/50">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-neutral-600 border-t-emerald-400 rounded-full mb-4"></div>
          <p className="text-neutral-400">Loading registrations...</p>
        </div>
      </div>
    )
  }

  if(error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 backdrop-blur-md bg-black/20 rounded-2xl border border-red-900/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500/80 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-semibold text-red-500/80 mb-2">Error Loading Registrations</h3>
        <p className="text-neutral-400 max-w-md text-center">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative animate-fadeIn">
      {isModalMinimized && (
        <div 
          onClick={expandModal}
          className="fixed top-20 right-10 z-10 bg-gradient-to-br from-neutral-900 to-black p-4 rounded-xl shadow-2xl border border-emerald-900/50 cursor-pointer transition-all hover:scale-105 animate-fade-in w-64"
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
      <div className={`sticky top-0 z-30 w-full flex justify-end transition-all duration-300`}>
        <div 
          className={`backdrop-blur-xl bg-transparent
          transition-all duration-300 rounded-xl`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center justify-end">
              <div className="relative w-full sm:w-64 md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className={`${isScrolled ? 'text-emerald-500/70' : 'text-neutral-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search teams or members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${
                    isScrolled 
                      ? 'bg-neutral-800/80 border-emerald-900/30 focus:ring-emerald-500/70' 
                      : 'bg-neutral-800/50 border-neutral-700/50'
                  } border rounded-lg py-2 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-lg`}
                />
              </div>

              {/* View Toggle */}
              <div className={`flex rounded-lg overflow-hidden border transition-colors ${
                isScrolled ? 'border-emerald-900/30 shadow-lg shadow-emerald-900/5' : 'border-neutral-700/50'
              }`}>
                <button
                  onClick={() => setViewMode('card')}
                  className={`flex items-center gap-2 px-3 py-2 ${
                    viewMode === 'card'
                      ? 'bg-emerald-600 text-white'
                      : `${isScrolled ? 'bg-neutral-800/80' : 'bg-neutral-800'} text-neutral-400 hover:bg-neutral-700`
                  } transition-colors`}
                >
                  <List size={18} />
                  <span className="hidden sm:inline">Cards</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-3 py-2 ${
                    viewMode === 'table'
                      ? 'bg-emerald-600 text-white'
                      : `${isScrolled ? 'bg-neutral-800/80' : 'bg-neutral-800'} text-neutral-400 hover:bg-neutral-700`
                  } transition-colors`}
                >
                  <Table size={18} />
                  <span className="hidden sm:inline">Table</span>
                </button>
                <button
                  onClick={downloadExcel}
                  className={`flex items-center gap-2 px-3 py-2 ${
                    isScrolled 
                      ? 'bg-neutral-800/80 border-l border-emerald-900/30' 
                      : 'bg-neutral-800 border-l border-neutral-700/50'
                  } text-neutral-400 hover:bg-neutral-700 transition-colors`}
                  title="Download Excel"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Content display based on view mode */}
      <div className="mt-8">
        {filteredRegistrations && filteredRegistrations.length > 0 ? (
          viewMode === 'card' ? (
            // Card View
            <div className="grid grid-cols-1 gap-8">
              {filteredRegistrations.map(({ team_id, team_name, members }: Team) => (
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
              ))}
            </div>
            
          ) : (
            // Table View
            <div className="overflow-x-auto backdrop-blur-sm bg-gradient-to-br from-black to-neutral-900/90 rounded-xl border border-neutral-800/50 shadow-lg">
              <table className="w-full text-sm text-left">
                <thead className="text-xs bg-neutral-800/50 text-emerald-300 uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-3 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => requestSort('team_name')}>
                      Team Name {getSortIndicator('team_name')}
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => requestSort('name')}>
                      Name {getSortIndicator('name')}
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => requestSort('rollno')}>
                      Roll No {getSortIndicator('rollno')}
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => requestSort('department')}>
                      Department {getSortIndicator('department')}
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => requestSort('yearofstudy')}>
                      Year {getSortIndicator('yearofstudy')}
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => requestSort('is_present')}>
                      Status {getSortIndicator('is_present')}
                    </th>
                    {event_type !== 'upcoming' && (
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedMembers.map((member) => (
                    <tr 
                      key={member.id} 
                      className={`${
                        selectedMembers.some(m => m.rollno === member.rollno)
                          ? 'bg-emerald-900/20 hover:bg-emerald-900/30'
                          : 'hover:bg-neutral-800/50'
                      } transition-colors border-t border-neutral-800/30`}
                    >
                      <td className="px-6 py-3 font-medium text-white">
                        <span className="bg-emerald-900/20 text-emerald-300 text-xs px-2 py-1 rounded border border-emerald-900/30">
                          {member.team_name}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-white">{member.name}</td>
                      <td className="px-6 py-3 text-emerald-400/80 font-mono">{member.rollno}</td>
                      <td className="px-6 py-3 text-neutral-400">{member.department}</td>
                      <td className="px-6 py-3 text-neutral-400">{member.yearofstudy}</td>
                      <td className="px-6 py-3">
                        {member.is_present ? (
                          <span className="inline-flex items-center text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded-md border border-emerald-900/50">
                            Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs bg-neutral-800/50 text-neutral-400 px-2 py-1 rounded-md border border-neutral-700/30">
                            Not Present
                          </span>
                        )}
                      </td>
                      {event_type !== 'upcoming' && (
                        <td className="px-6 py-3">
                          {!member.is_present ? (
                            <button
                              onClick={() => {
                                toggleMemberSelection(member);
                                setIsModalOpen(true);
                              }}
                              className="text-xs bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white px-3 py-1 rounded transition-all duration-200 shadow-sm hover:shadow-emerald-900/20 flex items-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Mark
                            </button>
                          ) : (
                            <span className="text-xs text-neutral-500">Marked</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          searchQuery ? (
            // No search results
            <div className="text-center py-16 backdrop-blur-sm bg-gradient-to-br from-black to-neutral-900/90 rounded-xl border border-neutral-800/50">
              <div className="bg-neutral-800/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-700/50">
                <Search size={32} className="text-neutral-500" />
              </div>
              <h3 className="text-2xl text-emerald-300 font-light mb-2">No matching results</h3>
              <p className="text-neutral-400 max-w-sm mx-auto">
                No teams or members found matching "{searchQuery}". Try adjusting your search.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            // No registrations
            <div className="text-center py-16 backdrop-blur-sm bg-gradient-to-br from-black to-neutral-900/90 rounded-xl border border-neutral-800/50">
              <div className="bg-neutral-800/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl text-emerald-300 font-light mb-2">No registrations yet</h3>
              <p className="text-neutral-400 max-w-sm mx-auto">
                There are currently no registered participants for this event. Check back later for updates.
              </p>
            </div>
          )
        )}
        
      </div>

      <ToastContainer theme='dark'/> 
      
      {/* Add CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f1f1f;
          border-radius: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #4b5563;
        }
      `}</style>
    </div>
  )
}