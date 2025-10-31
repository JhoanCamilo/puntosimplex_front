import { NavBar } from "../components/layout/Navbar"
import { ModuleButton } from "../components/buttons/ModuleButton"
import { FaUsers } from "react-icons/fa6";
import { MdTableRestaurant } from "react-icons/md";

export default function AdminView (){
    return(
        <>
            <NavBar/>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <ModuleButton title="Gestión usuarios" route="/GestionUsuarios" icon={<FaUsers />}/>
                <ModuleButton title="Gestión mesas" route="#" icon={<MdTableRestaurant />}/>
            </div>
        </>
    )
}