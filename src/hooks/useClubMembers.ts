import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDatawithRefreshToken, postData } from '../utils/customFetch';
import { toast } from 'react-toastify';

export interface ClubMember {
  id: number;
  name: string;
  rollno: string;
  department: string;
  yearofstudy: number;
  role: string;
}

export interface ClubMembersResponse {
  message: string;
  data: ClubMember[];
}

export interface RemoveMemberRequest {
  rollno: string;
}

const fetchClubMembers = async (): Promise<ClubMember[]> => {
  const getData = await getDatawithRefreshToken<ClubMembersResponse>("admin");
  const data = await getData('admin/getclubmembers');
  return data.data;
};

const removeMember = async (rollno: string): Promise<void> => {
  await postData('admin/remove-member', { rollno });
};

export const useClubMembers = () => {
  return useQuery<ClubMember[], Error>({
    queryKey: ['clubMembers'],
    queryFn: fetchClubMembers,
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubMembers'] });
      toast.success("Member removed successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark"
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove member", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark"
      });
    }
  });
};