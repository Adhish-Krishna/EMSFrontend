"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { 
    FiUsers, 
    FiBook, 
    FiCalendar, 
    FiUserCheck, 
    FiCheckCircle ,
    FiDownload,
    FiAward,
    FiTrash2,
    FiPlus
  } from 'react-icons/fi';
import { useOutsideClick } from "../ui/useOutsideClick";
import { Team, useGetRegistrations, useGetWinners, WinnerData } from "../../hooks/useEvents";
import AddWinnerModal from "./AddWinnerModal";
import RemoveWinnerModal from "./RemoveWinnerModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "../../utils/customFetch";
import { toast, ToastContainer } from "react-toastify";

export default function EventWinners({ event_id }: { event_id: string | undefined }) {
  const { data: winners } = useGetWinners({ event_id });
  const [activeWinner, setActiveWinner] = useState<WinnerData | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useOutsideClick(ref, () => setActiveWinner(null));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveWinner(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedPosition, setSelectedPosition] = useState(0);

  const queryclient = useQueryClient()

  const {data:registrations} = useGetRegistrations({event_id:event_id})

  const {mutate:addWinners} = useMutation({
    mutationFn : async () => {
        if (!selectedTeam?.team_id) {
            throw new Error('No team selected');
        }
        const response = await postData('event/addWinners',{
            event_id : Number(event_id),
            team_id : selectedTeam?.team_id,
            position : selectedPosition
        })
        return response;
    },
    onSuccess:(data) => {
        toast.success(data.message || "Winner added Successfully")
        queryclient.invalidateQueries({
          type:"active",
          queryKey: ["eventWinners",String(event_id)],
          predicate: (query) => 
            query.queryKey[0] === "eventWinners",
          exact : false
        })
        setShowAddModal(false)
        setSearchQuery('')
    },
    onError:(error) => {
        toast.error(error?.message || "Error happened While Adding Winner")
    }
  })


  const {mutate:removeWinner} = useMutation({
    mutationFn: async() => {
      if (!selectedTeam?.team_id) {
        throw new Error('No team selected');
      }
      const response = await postData('event/removeWinners',{
        event_id:Number(event_id),
        position : selectedPosition
      })
      return response
    },
    onSuccess:(data) => {
      toast.success(data.message || "Winner Removed Successfully")
      queryclient.invalidateQueries({
        type:"active",
        queryKey: ["eventWinners",String(event_id)],
        predicate: (query) => 
          query.queryKey[0] === "eventWinners",
        exact : false
      })
      setShowRemoveModal(false)
      setSearchQuery('')
  },
  onError:(error) => {
      toast.error(error?.message || "Error happened While Adding Winner")
  }
  })

  if (!winners) return (
    <div className="flex justify-center items-center h-screen w-screen bg-black">
      <div className="animate-spin h-12 w-12 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 w-full">
    
    <div className="flex flex-row justify-end gap-x-4 px-4 sm:px-6 lg:px-8 py-4">
        <button onClick={() => setShowRemoveModal(true)}
        className="px-6 py-2.5 bg-red-500/80 hover:bg-red-400/80 text-white rounded-xl flex items-center gap-2"
        >
            <FiTrash2 className="w-5 h-5" />
            Remove Winner
        </button>
  
        <button onClick={() => setShowAddModal(true)}
        className="px-6 py-2.5 bg-emerald-500/80 hover:bg-emerald-400/80 text-white rounded-xl flex items-center gap-2"
        >
            <FiPlus className="w-5 h-5" />
            Add Winner
        </button>
    </div>

    <RemoveWinnerModal
      isOpen={showRemoveModal}
      onClose={() => setShowRemoveModal(false)}
      winners={winners}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedTeam={selectedTeam}
      onSelectTeam={setSelectedTeam}
      selectedPosition={selectedPosition}
      onSelectPosition={setSelectedPosition}
      onConfirmRemove={() => {
        removeWinner()
    }}
    />

    <AddWinnerModal
      isOpen={showAddModal}
      onClose={() => setShowAddModal(false)}
      registrations={registrations}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedTeam={selectedTeam}
      onSelectTeam={setSelectedTeam}
      selectedPosition={selectedPosition}
      onPositionChange={setSelectedPosition}
      existingWinners={winners}
      onConfirmAdd={() => {
        addWinners()
      }}
    />


    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <AnimatePresence>
        {activeWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      <div className="mx-5 space-y-4">
        {winners.length > 0 ? (
          winners.sort((a, b) => a.position - b.position).map((winner) => (
            <motion.div
              key={winner.id}
              layoutId={`card-${winner.id}-${id}`}
              onClick={() => setActiveWinner(winner)}
              className={`px-8 py-4 rounded-2xl shadow-2xl border-2 backdrop-blur-sm ${
                winner.position === 1 
                  ? 'border-yellow-500/40 bg-gradient-to-br from-yellow-900/20 to-amber-900/10 hover:border-yellow-500/60'
                  : winner.position === 2 
                  ? 'border-gray-400/40 bg-gradient-to-br from-gray-800/20 to-slate-900/10 hover:border-gray-400/60'
                  : 'border-amber-700/40 bg-gradient-to-br from-amber-900/20 to-brown-900/10 hover:border-amber-700/60'
              }`}
            >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    winner.position === 1 ? 'bg-yellow-500/20' :
                    winner.position === 2 ? 'bg-gray-400/20' : 'bg-amber-700/20'
                  }`}>
                    <FiAward className={`text-2xl ${
                      winner.position === 1 ? 'text-yellow-400' :
                      winner.position === 2 ? 'text-gray-300' : 'text-amber-500'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {winner.teams.name}
                    </h3>
                    <p className={`${
                      winner.position === 1 ? 'text-yellow-400' :
                      winner.position === 2 ? 'text-gray-300' : 'text-amber-500'
                    }`}>
                      {winner.position === 1 ? 'First Place' : 
                       winner.position === 2 ? 'Second Place' : 'Third Place'}
                    </p>
                  </div>
                  
                </div>
                <motion.button
                  layoutId={`button-${winner.id}-${id}`}
                  className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-2"
                >
                  <FiDownload className="text-lg" />
                  <span>Certificate</span>
                </motion.button>
              </div>
              <div className="flex flex-row items-center justify-start gap-x-4 w-full">
                <div className="flex items-center gap-2 text-emerald-300">
                  <FiUsers className="w-5 h-5" />
                  <span className="font-medium">Team Members</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {winner.teams.teammembers.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="text-gray-200 text-sm">
                        {member.users.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
                </div>
                
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-black/30 rounded-2xl">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-xl text-emerald-200/80 font-light">
              No winners announced yet
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeWinner && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div
              layoutId={`card-${activeWinner.id}-${id}`}
              ref={ref}
              className="w-full max-w-2xl bg-gradient-to-br from-neutral-900 to-black border border-emerald-900/40 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <motion.h2
                      layoutId={`title-${activeWinner.id}-${id}`}
                      className="text-3xl font-bold text-emerald-400"
                    >
                      {activeWinner.teams.name}
                    </motion.h2>
                    <p className={`text-lg ${
                      activeWinner.position === 1 ? 'text-yellow-400' :
                      activeWinner.position === 2 ? 'text-gray-300' : 'text-amber-500'
                    }`}>
                      {activeWinner.position === 1 ? '🥇 First Place' : 
                       activeWinner.position === 2 ? '🥈 Second Place' : '🥉 Third Place'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveWinner(null)}
                    className="p-2 hover:bg-neutral-800 rounded-lg text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-black/30 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4 text-emerald-300">
                      <FiUsers className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Team Members</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeWinner.teams.teammembers.map((member) => (
                        <div 
                          key={member.id} 
                          className="group p-4 bg-neutral-800/40 rounded-lg transition-all hover:bg-neutral-700/30"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              {/* Main Info Row */}
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <div>
                                  <p className="font-medium text-white">{member.users.name}</p>
                                  <p className="text-sm text-emerald-400/80 font-mono">{member.users.rollno}</p>
                                </div>
                              </div>
                    
                              {/* Details Grid */}
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                  <FiBook className="w-4 h-4 text-emerald-400" />
                                  <span>{member.users.department}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <FiCalendar className="w-4 h-4 text-emerald-400" />
                                  <span>Year {member.users.yearofstudy}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <FiUserCheck className="w-4 h-4 text-emerald-400" />
                                  <span>{member.is_present  ? "Present" : 'Absent' }</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Status Indicator */}
                            <div className={`p-2 rounded-lg ${
                              member.is_present 
                                ? 'bg-emerald-900/30 text-emerald-300' 
                                : 'bg-red-900/30 text-red-300'
                            }`}>
                              <FiCheckCircle className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                

                  <div className="flex justify-end">
                    <button
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                    >
                      <FiDownload className="text-lg" />
                      Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    <ToastContainer theme="dark"/>
    </div>
  );
}