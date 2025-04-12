import {useContext, createContext, ReactNode, useState, useEffect} from 'react';
import axios from 'axios';

interface GlobalAuthContextType{
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string ) => Promise<number>;
    logout: ()=> Promise<number>;
    checkAuthStatus: ()=>Promise<boolean>;
}

const GlobalAuthContext = createContext<GlobalAuthContextType | undefined>(undefined);

interface GlobalAuthProviderProps{
    children: ReactNode;
}

const GlobalAuthProvider = ({children}: GlobalAuthProviderProps)=>{
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const login = async (username: string, password: string): Promise<number> =>{
        try{
            setLoading(true);
            const response = await axios.post(`${API_URL}/auth/global/login`,
                {
                    username: username,
                    password: password,
                },
                {
                    withCredentials: true
                }
            );
            if(response.status === 200){
                setIsAuthenticated(true);
                console.log("Authenticated from login");
                return 200;
            }
            else{
                return response.status;
            }
        }catch(err: any){
            return err.response?.status;
        }finally{
            setLoading(false);
        }
    }
    const logout = async (): Promise<number> =>{
        try{
            setLoading(true);
            const resposne = await axios.post(`${API_URL}/auth/global/logout`,
                {},
                {
                    withCredentials: true

                }
            );
            if(resposne.status === 200){
                setIsAuthenticated(false);
            }
            return resposne.status;
        }catch(err){
            return 500;
        }finally{
            setLoading(false);
        }
    }
    const checkAuthStatus = async (): Promise<boolean> =>{
        try{
            setLoading(true);
            const resposne = await axios.get(`${API_URL}/auth/global/status`,{
                withCredentials: true
            });
            if(resposne.status === 200){
                setIsAuthenticated(true);
                return true;
            }
            else{
                setIsAuthenticated(false);
                return false;
            }
        }catch(err: any){
            if(err.response?.status === 401){
                const response = await axios.get(`${API_URL}/auth/global/getnewaccesstoken`,{
                    withCredentials: true
                });
                if(response.status === 200){
                    return checkAuthStatus();
                }
                else{
                    setIsAuthenticated(false);
                    return false;
                }
            }
            else{
                setIsAuthenticated(false);
                return false;
            }
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        const checkStatus = async ()=>{
            await checkAuthStatus();
            setLoading(false);
        }
        checkStatus();
    }, []);

    const value = {
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuthStatus,
    }

    return(
        <GlobalAuthContext.Provider value={value}>
            {children}
        </GlobalAuthContext.Provider>
    );
}

const useGlobalAuth = (): GlobalAuthContextType =>{
    const context = useContext(GlobalAuthContext);
    if (context === undefined){
        throw new Error("useGlobalAuth must be used within GlobalAuth provider")
    }
    return context;
}

export {GlobalAuthProvider, useGlobalAuth}