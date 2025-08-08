import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Building, UserX, AlertTriangle } from 'lucide-react';
import { useRemoveMember,ClubMember } from '../../hooks/useClubMembers';

interface MemberCardProps {
  member: ClubMember;
  index: number;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, index }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const removeMemberMutation = useRemoveMember();

  const handleRemoveMember = () => {
    removeMemberMutation.mutate(member.rollno);
    setShowConfirmDialog(false);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-emerald-900/30 text-emerald-300 border-emerald-500/40';
      case 'president':
        return 'bg-blue-900/30 text-blue-300 border-blue-500/40';
      case 'vice-president':
        return 'bg-purple-900/30 text-purple-300 border-purple-500/40';
      case 'secretary':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/40';
      case 'member':
        return 'bg-gray-900/30 text-gray-300 border-gray-500/40';
      default:
        return 'bg-neutral-900/30 text-neutral-300 border-neutral-500/40';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group bg-white p-6 rounded-[10px] shadow border border-gray-200 hover:shadow-lg transition-all duration-300"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-black font-semibold text-lg">{member.name}</h3>
                <p className="text-blue-600/80 font-mono text-sm">{member.rollno}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{member.department}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Year {member.yearofstudy}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="px-3 py-1 rounded-full text-xs border bg-blue-50 text-blue-600 border-blue-200">
              {member.role}
            </span>
            <button
              onClick={() => setShowConfirmDialog(true)}
              disabled={removeMemberMutation.isPending}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 disabled:opacity-50"
              title="Remove member"
            >
              <UserX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4 border border-red-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-black font-semibold">Remove Member</h3>
                <p className="text-gray-500 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to remove <span className="text-black font-medium">{member.name}</span> ({member.rollno}) from the club?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-[10px] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveMember}
                disabled={removeMemberMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-[10px] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {removeMemberMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Removing...
                  </>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MemberCard;