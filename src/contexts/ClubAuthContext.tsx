import { useContext, createContext, useEffect, useState, ReactNode } from "react";
import axios from 'axios';

interface ClubAuthContextType{
    loading: boolean;
    isCAuthenticated: boolean; //included C to diffrentiate the attribute from GlobalAuthContext Type
    login: (rollno: string, club_id: number, password: string)=>Promise<number>;
    logout: ()=>Promise<number>;
    checkStatus: ()=>Promise<boolean>;
}

interface ClubAuthProviderProps{
    children: ReactNode;
}

const ClubAuthContext = createContext<ClubAuthContextType | undefined>(undefined);

const ClubAuthProvider = ({children}:ClubAuthProviderProps)=>{
    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const [loading, setLoading] = useState<boolean>(false);
    const [isCAuthenticated, setIsCAuthenticated] = useState<boolean>(false);
    const login = async (rollno: string, club_id: number, password: string): Promise<number>=>{
        try{
            setLoading(true);
            const resposne = await axios.post(`${API_URL}/auth/admin/login`,
                {
                    rollno: rollno,
                    club_id: club_id,
                    password: password
                },
                {
                    withCredentials: true
                }
            );
            if(resposne.status === 200){
                setIsCAuthenticated(true);
                return 200;
            }
            return resposne.status;
        }catch(err: any){
            setIsCAuthenticated(false);
            return err.response?.status;
        }finally{
            setLoading(false);
        }
    }
    const logout = async (): Promise<number> =>{
        try{
            setLoading(true);
            const response = await axios.post(`${API_URL}/auth/admin/logout`,{},{
                withCredentials: true
            });
            if(response.status === 200){
                setIsCAuthenticated(false);
                return 200;
            }
            return response.status;
        }catch(err: any){
            setIsCAuthenticated(true);
            return err.response?.status;
        }finally{
            setLoading(false);
        }
    }
    const checkStatus = async (): Promise<boolean>=>{
        try{
            setLoading(true);
            const response = await axios.get(`${API_URL}/auth/admin/status`,
                {
                    withCredentials: true
                }
            );
            if(response.status === 200){
                setIsCAuthenticated(true);
                return true;
            }
            else{
                setIsCAuthenticated(false);
                return false;
            }

        }catch(err: any){
            if(err.resposne?.status === 401){
                const response = await axios.get(`${API_URL}/auth/admin/getnewaccesstoken`,
                    {
                        withCredentials: true
                    }
                );
                if(response.status === 200){
                    return checkStatus();
                }
                else{
                    setIsCAuthenticated(false);
                    return false;
                }
            }else{
                setIsCAuthenticated(false);
                return false;
            }

        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        const checkAuthStatus = async ()=>{
            await checkStatus();
        }
        checkAuthStatus();
    }, []);

    const value = {
        loading,
        isCAuthenticated,
        login,
        logout,
        checkStatus,
    }

    return(
        <ClubAuthContext.Provider value={value}>
            {children}
        </ClubAuthContext.Provider>
    );
}

const useClubAuth = (): ClubAuthContextType =>{
    const context = useContext(ClubAuthContext);
    if(context === undefined){
        throw new Error("useClubAuth should be used under the ClubAuthContext provider");
    }
    return context;
}

export {useClubAuth, ClubAuthProvider}