import { PropsWithChildren } from "react"
import { useAuthContext } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

type Role = "global" | "club";

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles ?: Role[]
}

export default function ProtectedRoute({allowedRoles,children}:ProtectedRouteProps) {
  const {role} = useAuthContext()
  const navigate = useNavigate()

  console.log("This is from protected Route :",role)
  
  if(role === undefined) {
    return <div>loading ....</div>
  }

  if(role === null || (allowedRoles && !allowedRoles.includes(role))){
     navigate('/')
  }


  return (
    children
  )
}
