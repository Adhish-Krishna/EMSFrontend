import React from 'react'
import { useGetRegistrations } from '../../hooks/useEvents';
 import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function EventAttendance({ event_id }: { event_id: string | undefined }) {
  const { data: registrations, isLoading, isError } = useGetRegistrations({ event_id });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isError || !registrations) {
    return (
      <div className="text-center py-8 text-red-400 text-lg">
        Failed to load attendance data
      </div>
    );
  }

  const totalMembers = registrations.reduce((acc, team) => acc + team.members.length, 0);
  const presentMembers = registrations.reduce(
    (acc, team) => acc + team.members.filter(m => m.is_present).length,
    0
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Attendance Header */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-black/40 to-neutral-900/50 p-6 rounded-2xl shadow-2xl border border-emerald-900/30"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-emerald-300 text-2xl font-bold tracking-wide">
            Attendance Overview
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-emerald-400 text-sm">Total Members</p>
              <p className="text-white text-2xl font-bold">{totalMembers}</p>
            </div>
            <div className="h-8 w-px bg-emerald-900/50" />
            <div className="text-center">
              <p className="text-emerald-400 text-sm">Present</p>
              <p className="text-white text-2xl font-bold">{presentMembers}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm text-emerald-200">
            <span>Attendance Progress</span>
            <span>{Math.round((presentMembers / totalMembers) * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(presentMembers / totalMembers) * 100}%` }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-3 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Teams List */}
      <motion.div variants={containerVariants} className="space-y-6">
        {registrations.map((team) => (
          <motion.div
            key={team.team_id}
            variants={itemVariants}
            className="bg-gradient-to-br from-black/40 to-neutral-900/50 p-6 rounded-2xl shadow-2xl border border-emerald-900/30"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-emerald-300 text-xl font-semibold">
                {team.team_name}
              </h3>
              <span className="text-emerald-400/80 text-sm">
                {team.members.filter(m => m.is_present).length}/{team.members.length} Present
              </span>
            </div>

            {/* Members List */}
            <div className="space-y-3">
              {team.members.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group bg-neutral-800/40 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between transition-all duration-200 hover:bg-neutral-700/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {member.is_present ? (
                        <FiCheckCircle className="text-emerald-400 w-6 h-6" />
                      ) : (
                        <FiXCircle className="text-red-400 w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-emerald-400/80 text-sm">{member.rollno}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      member.is_present 
                        ? 'bg-emerald-900/30 text-emerald-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}>
                      {member.is_present ? 'Present' : 'Absent'}
                    </span>
                    <p className="text-gray-400 text-sm mt-1">
                      {member.department} • Year {member.yearofstudy}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}