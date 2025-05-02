import React from 'react';
import { FiSearch, FiX, FiTrash2 } from 'react-icons/fi';
import { motion } from "framer-motion";
import { Team, WinnerData } from '../../hooks/useEvents';


interface RemoveWinnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    winners: WinnerData[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedPosition: number | null;  
    onSelectPosition: (position: number) => void; 
    selectedTeam: Team | null;
    onSelectTeam: (team: Team) => void;
    onConfirmRemove: () => void;  
}

const RemoveWinnerModal = ({ 
    isOpen,
    onClose,
    winners,
    searchQuery,
    onSearchChange,
    selectedTeam,
    selectedPosition,
    onSelectTeam,
    onSelectPosition,
    onConfirmRemove
}: RemoveWinnerModalProps) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
        >
            <div className="bg-gradient-to-br from-neutral-900 to-black rounded-2xl p-6 w-full max-w-md mx-4 border border-emerald-900/40">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-emerald-400">Remove Winner</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-gray-400 hover:text-white"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                <div className="relative mb-4">
                    <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search winners..."
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                {winners
                 .filter(winner => 
                   winner.teams.name.toLowerCase().includes(searchQuery.toLowerCase())
                 )
                 .map(winner => {
                   const team: Team = {
                     team_id: winner.teams.id,
                     team_name: winner.teams.name,
                     members: winner.teams.teammembers.map(tm => ({
                       id: tm.users.id.toString(),
                       name: tm.users.name,
                       rollno: tm.users.rollno,
                       department: tm.users.department,
                       yearofstudy: tm.users.yearofstudy,
                       is_present: tm.is_present
                     }))
                   };
               
                   return (
                     <motion.div
                       key={winner.id}
                       onClick={() => {onSelectTeam(team); 
                        
                        onSelectPosition(winner.position)}}
                       className={`p-3 rounded-lg cursor-pointer transition-all relative
                         ${
                           selectedTeam?.team_id === team.team_id
                             ? 'bg-emerald-900/30 border-2 border-emerald-400 shadow-lg shadow-emerald-900/20'
                             : 'bg-neutral-800/40 border border-transparent hover:border-emerald-900/50'
                         }`}
                       whileHover={{ scale: 1.01 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <div className="flex justify-between items-center">
                         <div>
                           <p className="text-white font-medium">{team.team_name}</p>
                           <p className="text-sm text-emerald-400/80">
                             Position {winner.position}
                           </p>
                         </div>

                         {selectedTeam?.team_id === team.team_id && 
                        (
                           <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                             <span className="text-emerald-400 text-sm">Selected</span>
                           </div>
                         )}
                       </div>
                     </motion.div>
                   );
                 })}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-neutral-800/50 hover:bg-neutral-700/50 text-gray-300 rounded-xl"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (selectedPosition !== null) {
                                onConfirmRemove()
                            }
                        }}
                        className="px-6 py-2.5 bg-red-500/80 hover:bg-red-400/80 text-white rounded-xl flex items-center gap-2"
                    >
                        <FiTrash2 className="w-5 h-5" />
                        Confirm Remove
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default RemoveWinnerModal;