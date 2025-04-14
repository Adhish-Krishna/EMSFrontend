import { useContext, createContext, useState, ReactNode} from "react";
import axios from 'axios';

interface AdminData{
    name: string;
    rollno: string;
    club: string;
}

interface AdminContextType{
    adminData: AdminData;
    loading: boolean;
    isFetched: boolean;
    fetchProfile: ()=>Promise<void>;
}

interface AdminContextProps{
    children: ReactNode;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const AdminContextProvider = ({children}: AdminContextProps)=>{
    const admin_data: AdminData = {
        name: '',
        rollno: '',
        club: '',
    }
    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const [adminData, setAdminData] = useState<AdminData>(admin_data);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFetched, setIsFetched] = useState<boolean>(false);
    const fetchProfile = async (): Promise<void>=>{
        try{
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/profile`,{
                withCredentials: true
            });
            if(response.status === 200){
                const data: AdminData = response.data.data;
                setAdminData(data);
                setIsFetched(true);
            }
            else if(response.status === 301){
                setIsFetched(false);
            }
        }catch(err){
            setIsFetched(false);

        }finally{
            setLoading(false);
        }
    }

    const value = {
        adminData,
        loading,
        isFetched,
        fetchProfile
    }

    return(
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

const useAdmin = (): AdminContextType=>{
    const context = useContext(AdminContext);
    if(context === undefined){
        throw new Error("AdminContext sould only be used under the AdminContextProvider");
    }
    return context;
}

export {AdminContextProvider, useAdmin}