import { NavBar } from "../../components/layout/Navbar";
import { ModuleButton } from "../../components/buttons/ModuleButton";
import { PiBowlFoodFill } from "react-icons/pi";
import { MdCategory } from "react-icons/md";

export default function InventarioHome() {
  return <>
    <NavBar />
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <ModuleButton title="Gestión Artículos" route="/Articulos" icon={<PiBowlFoodFill/>}/>
        <ModuleButton title="Gestión Categorías" route="#" icon={<MdCategory/>}/>
    </div>
  </>;
}