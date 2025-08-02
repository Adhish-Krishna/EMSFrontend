import { createContext, PropsWithChildren, useContext, useState,useEffect } from "react"
import { postData } from "../utils/customFetch";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    role:"global" | "club" | null | undefined;
    isAuthPending : boolean;
    setRole : (role:"global" | "club" | null)  => void 
    globalAdminLogin:UseMutateFunction<ResponseBody, Error, GlobalLoginCrentials, unknown>
    clubAdminLogin:UseMutateFunction<ResponseBody, Error, clubLoginCrentials, unknown>,
    logoutGlobalUser:UseMutateFunction<ResponseBody, Error, void, unknown>,
    logoutClubUser:UseMutateFunction<ResponseBody, Error, void, unknown>,
}


const AuthContext = createContext<AuthContextType| undefined>(undefined);

interface GlobalLoginCrentials {
    username: string;
    password: string;
}

interface clubLoginCrentials {
    rollno:string,
    club_id:number,
    password:string
}
  
interface ResponseBody {
    message:string;
}
   
const loginGlobalUser = async (credentials: GlobalLoginCrentials): Promise<ResponseBody> => {
    const response = await postData('auth/global/login', credentials);
    console.log(response)
    return response;
};

const loginClubAdmin = async(credentials:clubLoginCrentials) : Promise<ResponseBody> => {
    const response = await postData('auth/admin/login', credentials);
    return response;
}

const logoutGlobalAdmin = async()  : Promise<ResponseBody> => {
    const response = await postData('auth/global/logout',{})
    return response;
}

const logoutClubAdmin = async()  : Promise<ResponseBody> => {
    const response = await postData('auth/admin/logout',{})
    return response;
}


const cacheRole = async (role: "global" | "club" | null) => {
    const cache = await caches.open('auth-cache');
    if (role === null) {
        // Clear the cache entry when logging out
        await cache.delete('/auth/role');
    } else {
        await cache.put('/auth/role', new Response(JSON.stringify({ role })));
    }
};

const getCachedRole = async (): Promise<"global" | "club" | null> => {
    try {
        const cache = await caches.open('auth-cache');
        const response = await cache.match('/auth/role');
        if (!response) return null;
        const data = await response.json();
        return data.role as "global" | "club" | null;
    } catch (error) {
        console.error('Failed to get cached role:', error);
        return null;
    }
};


export default function AuthProvider({children}:PropsWithChildren) {
  const [role,setRoleState] = useState<"global" | "club" | null>();
  const navigate = useNavigate()

const setRole = (newRole: "global" | "club" | null) => {
    setRoleState(newRole);
    cacheRole(newRole);
};

  useEffect(() => {
    getCachedRole().then(cached => {
        setRoleState(cached);
    });
  }, []);


  const {mutate:globalAdminLogin,isPending:isGlobalLoginPeding} = useMutation<ResponseBody,Error,GlobalLoginCrentials>({
    mutationFn:loginGlobalUser,
    onSuccess:(data)=>{
        setRole("global")
        toast.success(data.message || "Logged in successfully!")
        navigate('/global/dashboard')
    },
    onError:(error) => {
        setRoleState(null)
        console.log(error.message)
        toast.error(error?.message || "Failed to log in")
    },
  })

  const {mutate:clubAdminLogin,isPending:isAdminLoginPending} = useMutation<ResponseBody,Error,clubLoginCrentials>({
    mutationFn:loginClubAdmin,
    onSuccess:(data)=>{
        setRole("club")
        toast.success(data.message || "Logged in successfully!")
        navigate('/club/dashboard')
    },
    onError:(error) => {
        setRoleState(null)
        toast.error(error?.message || "Failed to log in")
    },
  })

  const {mutate:logoutGlobalUser,isPending:isGlobalLogoutPending} = useMutation<ResponseBody,Error>({
    mutationFn:logoutGlobalAdmin,
    onSuccess:(data)=>{
      toast.success(data.message || "Logged Out successfully")
      setRole(null)
      navigate("/")
    },
    onError:(error) => {
      toast.success(error?.message || "Logged Out failed")
      setRole(null)
      navigate("/")
    },
  })

  const {mutate:logoutClubUser,isPending:isClubLogoutPending} = useMutation<ResponseBody,Error>({
    mutationFn:logoutClubAdmin,
    onSuccess:(data)=>{
      toast.success(data.message || "Logged Out successfully")
      setRole(null)
      navigate("/")
    },
    onError:(error) => {
      toast.success(error?.message || "Logged Out failed")
      setRole(null)
      navigate("/")
    },
  })
  
  const isAuthPending = isGlobalLoginPeding || isAdminLoginPending || isGlobalLogoutPending || isClubLogoutPending
  
    
  return (
    <AuthContext.Provider value={{role,isAuthPending,setRole,globalAdminLogin,
    clubAdminLogin,logoutGlobalUser,logoutClubUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () : AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined){
        throw new Error("The authProvider should be inside the AuthContext")
    }
    return context;
}

