import React, { createContext, useContext, useState } from 'react';
import { Outlet, useNavigate} from 'react-router-dom';

import { useQuery } from '@tanstack/react-query'
import ClubSideBar from '../components/ClubComponents/ClubSideBar';
import Header from '../components/ClubHeader';
import { useAuthContext } from '../contexts/AuthProvider';
import { getDatawithRefreshToken } from '../utils/customFetch';


interface clubProfile {
  name:string;
  rollno:string;
  club:string;
}



interface clubProfileResponse {
  message:string;
  data:clubProfile
} 

interface ContextValueProps {
   clubprofile:clubProfile | undefined
}

const ClubContext = createContext<ContextValueProps | undefined>(undefined)

const fetchProfile = async():Promise<clubProfile> => {
  const getData = await getDatawithRefreshToken<clubProfileResponse>("admin")
  const data = await getData('admin/profile')
  return data.data
}


const MainLayout = () => {
  const [open, setOpen] = useState<boolean> (false);
  
  const {data:clubprofile} = useQuery<clubProfile,Error>({
    queryKey:["clubProfile"],
    queryFn:fetchProfile,
  })

  const {role} = useAuthContext()  
  const navigate = useNavigate()
  if(role === undefined){
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-black">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if(role === null) navigate("/")

  

    
  return (
    <ClubContext.Provider value={{clubprofile}}>
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900"> 
        <Header/>
        <ClubSideBar open={open} setOpen = {setOpen}/>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </ClubContext.Provider>
  );
};


export const useClubContext = () => {
  const context = useContext(ClubContext)
  if(context === undefined) {
    console.log("Club Context should be only used inside The club Page")
  }
  return context
}

export default MainLayout;