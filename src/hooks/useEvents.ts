
import { Event } from '../pages/clubAdmin/EventsPage'
import { useQuery } from '@tanstack/react-query';
import { getDatawithRefreshToken } from '../utils/customFetch';

interface eventResponse {
    message:string;
    data:Event[]
}

interface SingleEventResponse {
    message:string;
    data:Event;
}

export interface User {
    id: number;
    name: string;
    rollno: string;
    department: string;
    email: string;
    yearofstudy: number;
  }
  
  export interface Feedback {
    id: number;
    user_id: number;
    event_id: number;
    feedback: string;
    rating: number;
    created_at: string; // ISO date string
    users: User;
  }


interface FeedbackReponse {
    message : string;
    data : Feedback[]
}

export interface TeamMember {
    id:string;
    name: string;
    rollno: string;
    department: string;
    yearofstudy: number;
    is_present : boolean;
  }
  
  export interface Team {
    team_id: number;
    team_name: string;
    members: TeamMember[];
  }
 
interface RegistatationResponse {
    message:string;
    data:Team[]
}

export interface WinnerData {
  id: number;
  team_id: number;
  event_id: number;
  position: number;
  teams: {
    id: number;
    name: string;
    event_id: number;
    teammembers: {
      id: number;
      user_id: number;
      team_id: number;
      event_id: number;
      is_present: boolean;
      users: User;
    }[];
  };
}
interface getWinnersResponse {
    message:string,
    data : WinnerData[]
}

const fetchEventsWithType = (type:string) => {
    return async () : Promise<Event[]> => {
        const getData = await getDatawithRefreshToken<eventResponse>("admin")
        const data = await getData(`admin/events?type=${type}`)
        return data.data;
    }
}

const fetchSingleEvent = (event_id:string) => {
    return async () : Promise<Event> => {
        const getData = await getDatawithRefreshToken<SingleEventResponse>("admin")
        const data = await getData(`event/eventdetails?id=${event_id}`)
        return data.data
    }
}

const fetchFeedback = (event_id:string) => {
    return async () : Promise<Feedback[]> => {
        const getData = await getDatawithRefreshToken<FeedbackReponse>("admin")
        const data = await getData(`event/feedback/${event_id}`)
        return data.data;
    }
}

const fetchRegistrations = (event_id:string) => {
    return async () => {
        const getData = await getDatawithRefreshToken<RegistatationResponse>("admin")
        const data = await getData(`event/allregistration/${event_id}`)
        return data.data
    }
}

const fetchWinners = (event_id:string) => {
    return async () => {
        const getData = await getDatawithRefreshToken<getWinnersResponse>("admin");
        const data = await getData(`event/winners/${event_id}`)
        return data.data
    }
}


export default function useEvents({type}:{type:string}) {
    return useQuery<Event[],Error>({
        queryKey:[`${type}events`],
        queryFn:fetchEventsWithType(type),
    })
}

export function useSingleEvent ({event_id}:{event_id?:string}){
    return useQuery<Event,Error>({
        queryKey:['getEvent',event_id],
        queryFn:fetchSingleEvent(event_id!),
        enabled:!!event_id
    })
}

export function useGetFeedback ({event_id}:{event_id?:string}) {
    return useQuery<Feedback[],Error>({
        queryKey : ["eventfeedback",event_id],
        queryFn: fetchFeedback(event_id!),
        enabled:!!event_id
    })
}

export function useGetRegistrations ({event_id}:{event_id?:string}){
    return useQuery<Team[],Error>({
        queryKey:["eventRegistrations",event_id],
        queryFn:fetchRegistrations(event_id!),
        enabled : !!event_id
    })
}

export function useGetWinners ({event_id}:{event_id?:string}) {
    return useQuery<WinnerData[],Error>({
        queryKey:["eventWinners",event_id],
        queryFn:fetchWinners(event_id!),
        enabled : !!event_id
    })
}
