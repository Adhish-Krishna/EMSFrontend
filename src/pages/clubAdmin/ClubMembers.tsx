import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useClubMembers } from '../../hooks/useClubMembers';
import MemberCard from '../../components/ClubComponents/MemberCard';
import MembersSearch from '../../components/ClubComponents/MemberSearch';
import { useClubContext } from '../../layout/ClubAdminLayout';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
};

const ClubMembers: React.FC = () => {
  const navigate = useNavigate();
  const club = useClubContext();
  const clubProfile = club?.clubprofile;
  
  const { data: members, isLoading, isError } = useClubMembers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Get available filter options
  const { availableRoles, availableYears } = useMemo(() => {
    if (!members) return { availableRoles: [], availableYears: [] };
    
    const roles = [...new Set(members.map(member => member.role))].sort();
    const years = [...new Set(members.map(member => member.yearofstudy))].sort((a, b) => a - b);
    
    return { availableRoles: roles, availableYears: years };
  }, [members]);

  // Filter members based on search and filters
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    
    return members.filter(member => {
      const matchesSearch = searchTerm === '' || 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.rollno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === '' || member.role === roleFilter;
      const matchesYear = yearFilter === '' || member.yearofstudy.toString() === yearFilter;
      
      return matchesSearch && matchesRole && matchesYear;
    });
  }, [members, searchTerm, roleFilter, yearFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Failed to load members</h2>
        <p className="text-gray-400 mb-4">There was an error loading the club members.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{ marginTop: '75px' }} 
      className="w-full  text-white py-8"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center my-4">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
            {clubProfile?.club || 'Club'} Members
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage your club members. You can view all members, search through them, and remove members when needed.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-6">
              <div
                className="flex items-center gap-3 
                           bg-gradient-to-br from-black-700/30 via-black-900/20 to-neutral-800/50 
                           backdrop-blur-md
                           px-6 py-3 rounded-2xl border border-emerald-900/40 shadow-lg 
                           hover:shadow-emerald-500/30 hover:border-emerald-400/50 
                           hover:-translate-y-1 hover:scale-105 transition-all duration-300"
              >
                <Users className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                <div>
                  <p className="text-2xl font-bold text-white">{members?.length || 0}</p>
                  <p className="text-emerald-400 text-sm">Total Members</p>
                </div>
              </div>

              {/* Filtered Results Card */}
              {filteredMembers.length !== members?.length && (
                <div
                  className="flex items-center gap-3 
                             bg-gradient-to-br from-emerald-700/30 via-emerald-900/20 to-black/50 
                             backdrop-blur-md
                             px-6 py-3 rounded-2xl border border-emerald-900/40 shadow-lg 
                             hover:shadow-emerald-500/30 hover:border-emerald-400/50 
                             hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                >
                  <div>
                    <p className="text-2xl font-bold text-white">{filteredMembers.length}</p>
                    <p className="text-emerald-400 text-sm">Filtered Results</p>
                  </div>
                </div>
              )}
            </div>

          <button
            onClick={() => navigate('/club/member/add')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 
                       text-white font-medium rounded-xl shadow-lg 
                       hover:shadow-emerald-600/50 hover:scale-110 active:scale-95 
                       hover:-translate-y-0.5 transition-all duration-300"
          >
            <UserPlus className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
            Add Member
          </button>
        </motion.div>

       <div className='sticky  top-15 z-10  backdrop-blur-md px-3 py-2 rounded-lg shadow-lg mb-3'>
        <motion.div variants={itemVariants}>
          <MembersSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
            availableRoles={availableRoles}
            availableYears={availableYears}
          />
        </motion.div>
      </div>

        {/* Members Grid */}
        <motion.div variants={itemVariants}>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchTerm || roleFilter || yearFilter ? 'No members found' : 'No members yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || roleFilter || yearFilter 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Start by adding some members to your club.'
                }
              </p>
              {!searchTerm && !roleFilter && !yearFilter && (
                <button
                  onClick={() => navigate('/club/member/add')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors"
                >
                  Add First Member
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} />
              ))}
              
            </div>
          )}
        </motion.div>

        <ToastContainer theme="dark" />
      </motion.div>
    </div>
  );
};

export default ClubMembers;
