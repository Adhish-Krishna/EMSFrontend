import { useQuery } from "@tanstack/react-query";
import { ClubData, ClubResponse } from '../pages/globalAdmin/AddClubAdmin';
import { getDatawithRefreshToken } from "../utils/customFetch";

export interface EventConvenor {
  name: string;
  department: string;
  yearofstudy: number;
}

export interface Event {
  name: string;
  about: string;
  date: string; 
  event_type: string;
  event_category: string;
  eventConvenors: EventConvenor[];
  eventWinners: {
    position: number,
    team_name : string,
  }[],
  average_rating: number;
  total_registered_teams: number;
  total_attendance: number;
}
interface PastEventResponse {
  message :string,
  data:Event[]
}



const fetchClubDetails = async (): Promise<ClubData[]> => {
  const getData = await getDatawithRefreshToken<ClubResponse>("admin")
  const data = await getData('club/getclubs')
  return data.data
};

const fetchPastEvents = async () : Promise<Event[]> => {
  const getData = await getDatawithRefreshToken<PastEventResponse>("admin")
  const data = await getData('admin/events-history')
  return data.data
}

export const useClubs = () => {
  return useQuery<ClubData[], Error>({
    queryKey: ['clubs'],
    queryFn: fetchClubDetails,
  });
};

export const usePastEvents = () => {
  return useQuery<Event[],Error>({
    queryKey:['event-history'],
    queryFn:fetchPastEvents
  })
}
