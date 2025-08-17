import React from 'react';
import { X } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import AddClubMembers from './AddClubMember';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddMemberSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Blur Overlay */}
            <div 
                className={`fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity duration-300 z-40
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed right-0 top-[75px] h-[calc(100%-75px)] w-[350px] bg-secondary/95 border-l border-border
                transform transition-transform duration-300 ease-in-out z-50
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-white">Add Club Members</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Only render AddClubMembers */}
                <div className="h-[calc(100%-64px)] overflow-y-auto">
                    <div className="p-4">
                        <AddClubMembers />
                    </div>
                </div>
            </div>

            <ToastContainer theme='dark' />
        </>
    );
};

export default AddMemberSidebar;