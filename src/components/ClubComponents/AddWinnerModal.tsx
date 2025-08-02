import { Team, WinnerData } from "../../hooks/useEvents";
import { motion } from 'framer-motion'
import { FiSearch, FiPlus, FiX, FiAward } from 'react-icons/fi';

interface AddWinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Team[] | undefined;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTeam: Team | null;
  onSelectTeam: (team: Team) => void;
  selectedPosition: number;
  onPositionChange: (position: number) => void;
  onConfirmAdd: () => void;
  existingWinners: WinnerData[];
}

const AddWinnerModal = ({
  isOpen,
  onClose,
  registrations,
  searchQuery,
  onSearchChange,
  selectedTeam,
  onSelectTeam,
  selectedPosition,
  onPositionChange,
  onConfirmAdd,
  existingWinners
}: AddWinnerModalProps) => {
  if (!isOpen) return null;


  const occupiedPositions = existingWinners.map(w => w.position);

  const allPositions = [1, 2, 3, 4, 5, 6];
  const availablePositions = allPositions.filter(
    position => !occupiedPositions.includes(position)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
    >
      <div className="bg-gradient-to-br from-neutral-900 to-black rounded-2xl p-6 w-full max-w-md mx-4 border border-emerald-900/40">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-400">Add Winner</h2>
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
            placeholder="Search registered teams..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
          {registrations
            ?.filter(team => {
                const isAlreadyWinner = existingWinners.some(winner => 
                  winner.teams.id === team.team_id
                );
                // Add null check for team_name before calling toLowerCase()
                const matchesSearch = team.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
                
                return !isAlreadyWinner && matchesSearch;
            })
            .map(team => (
              <div
                key={team.team_id}
                onClick={() => onSelectTeam(team)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTeam?.team_id === team.team_id
                    ? 'bg-emerald-900/30 border border-emerald-500/40'
                    : 'bg-neutral-800/40 hover:bg-neutral-700/30'
                }`}
              >
                <p className="text-white font-medium">{team.team_name || 'Unnamed Team'}</p>
                <p className="text-sm text-emerald-400/80">
                  {team.members.length} members
                </p>
              </div>
            ))}
        </div>

        <div className="mb-6">
        <label className="block text-sm text-emerald-300 mb-2">Select Position</label>
        <div className="grid grid-cols-3 gap-3">
          {availablePositions.map(position => {
            const positionLabel = position === 1 ? 'st' : 
                               position === 2 ? 'nd' : 
                               position === 3 ? 'rd' : 'th';
            
            return (
              <button
                key={position}
                onClick={() => onPositionChange(position)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 justify-center ${
                  selectedPosition === position
                    ? 'bg-emerald-500/80 text-white'
                    : 'bg-neutral-800/50 text-gray-300 hover:bg-neutral-700/50'
                }`}
              >
                {position === 1 && <FiAward className="w-5 h-5" />}
                {position}{positionLabel}
              </button>
            )
          })}
        </div>
        
        {availablePositions.length === 0 && (
          <div className="text-center text-red-400 mt-3">
            All positions are already occupied
          </div>
        )}
      </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-800/50 hover:bg-neutral-700/50 text-gray-300 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmAdd}
            className="px-6 py-2.5 bg-emerald-500/80 hover:bg-emerald-400/80 text-white rounded-xl flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Confirm Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddWinnerModal;