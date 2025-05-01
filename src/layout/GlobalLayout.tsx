import { Outlet } from "react-router-dom";
import GlobalHeader from "../components/GlobalHeader";

export default function GlobalLayout() {
  return (
    <>
        <GlobalHeader/>
        <Outlet/>
    </>
    
  )
}
