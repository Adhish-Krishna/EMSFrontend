import React, { useState } from 'react';
import EventSearch from '../../components/ClubComponents/EventsSearch';
import EventTabs from '../../components/ClubComponents/EventsTabs';
import { useClubContext } from '../../layout/ClubAdminLayout';
import {PastEventsList,OngoingEvents,UpcomingEvents} from '../../components/ClubComponents/TypeEventsList';

export interface Event {
  id: number;
  name: string;
  about: string;
  date: string;
  event_type: string;
  venue: string;
  event_category: string;
  min_no_member: number;
  max_no_member: number;
  chief_guest?: string;
  exp_expense?: number;
  tot_amt_allot_su?: number;
  tot_amt_spt_dor?: number;
  exp_no_aud?: number;
  faculty_obs_desig?: string;
  faculty_obs_dept?: string;
  poster?: string;
}

export type TabType = 'upcoming' | 'past' | 'ongoing';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('ongoing');

  const club = useClubContext();
  const clubprofile = club?.clubprofile;

  /* Work on search functionality */

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };


  return (
    <div style={{ marginTop: '100px' }} className="min-h-screen  text-white content-container w-screen py-5 flex flex-col justify-start items-center gap-[20px] responsive-p-sm  md:p-8 ">
      <div className="container px-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
          {`${clubprofile?.club || 'Club Name'}`}
          </h1> 
          <p className="text-gray-400 max-w-md mx-auto">
            Use The search field to search for a event
          </p>
        </div>
        
        <EventSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <EventTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className="mt-6">
          {activeTab === 'past' && <PastEventsList/>}
          {activeTab === 'upcoming' && <UpcomingEvents/>}
          {activeTab === 'ongoing' && <OngoingEvents/>}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;