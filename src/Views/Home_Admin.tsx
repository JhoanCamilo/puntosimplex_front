import { NavBar } from "../components/layout/Navbar"
import { ModuleButton } from "../components/buttons/ModuleButton"
import { FaUsers } from "react-icons/fa6";

export default function AdminView (){
    return(
        <>
            <NavBar/>
            <ModuleButton title="Gestión usuarios" route="#" icon={<FaUsers />}/>
        </>
    )
}