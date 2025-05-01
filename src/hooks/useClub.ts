import { useQuery } from "@tanstack/react-query";
import { ClubData, ClubResponse } from '../pages/globalAdmin/AddClubAdmin';
import { getDatawithRefreshToken } from "../utils/customFetch";

const fetchClubDetails = async (): Promise<ClubData[]> => {
  const getData = await getDatawithRefreshToken<ClubResponse>("admin")
  const data = await getData('club/getclubs')
  return data.data
};

export const useClubs = () => {
  return useQuery<ClubData[], Error>({
    queryKey: ['clubs'],
    queryFn: fetchClubDetails,
  });
};
