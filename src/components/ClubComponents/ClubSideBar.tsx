import React from 'react'
import {
    LayoutDashboard,
    Calendar,
    PlusCircle,
    Users,
    User2,
    LogOut,
    ClipboardList,
    Menu // Import the Menu icon
} from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink,} from '../ui/sidebar';
import {cn} from '../../utils'
import { useAuthContext } from '../../contexts/AuthProvider';



const sidebarLinks = [
    { name: 'Dashboard', path: '/club/dashboard', icon: <LayoutDashboard className='w-full items-center justify-center' /> },
    { name: 'All Events', path: '/club/events', icon: <Calendar className='w-full items-center justify-center'/> },
    { name: 'Create Event', path: '/club/event/create', icon: <PlusCircle className='w-full items-center justify-center'/> },
    { name: 'Members', path: '/club/members', icon: <Users className='w-full items-center justify-center' /> },
    { name: 'Add Member', path: '/club/member/add', icon: <ClipboardList className='w-full items-center justify-center' /> },
    { name: 'Profile', path: '/club/profile', icon: <User2 className='w-full items-center justify-center' /> },
  ];


interface ClubSideBarProps {
  open:boolean;
  setOpen : React.Dispatch<React.SetStateAction<boolean>> | undefined
} 

export default function ClubSideBar({open,setOpen}:ClubSideBarProps) {
  const {logoutClubUser} = useAuthContext()
 
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="bg-sidebar-primary mt-15">
        {/* Top Logo/Header */}
        <div className="border-b border-club_dark-700 py-6 px-2 ">
          <div className={` absolute${open ? "justify-start" : "justify-center"}`}>
        
            <button
              onClick={() => setOpen && setOpen((prev) => !prev)}
              className="absolute w-full text-white"
              aria-label="Toggle sidebar"
              type="button"
            >
              <Menu className="flex flex-col  " />
            </button>
            
            
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col gap-2 mt-6">
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.name}
              link={{
                label: link.name,
                href: link.path,
                icon: link.icon,
              }}
            />
          ))}
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-auto pb-6">
          <button
            className={cn(
              `flex items-center gap-3 px-3 py-4 rounded-xl transition-all duration-200 relative group
                text-gray-600 hover:bg-secondary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800 w-full
              `,
              open ? "justify-start" : "justify-around"
            )}
            onClick={ () => logoutClubUser()}
          >
            <div className="flex items-center justify-center w-6 h-6">
              <LogOut className="w-full h-full" />
            </div>

            {open  === true && (
              <span className="text-lg transition-opacity duration-200">
                Logout
              </span>
            )}
          </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}




