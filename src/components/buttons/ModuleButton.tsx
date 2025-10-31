import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type React from "react";
import "../styles/buttonStyles.css"

interface ModuleBtnProps{
    title: string
    route: string
    icon: ReactNode
}

export const ModuleButton : React.FC<ModuleBtnProps> = ({title, icon, route}) => {
    return(
        <Link to={route} className="linkContainer">
            <div className="butttonContainer">
                <p className="icono">
                    {icon}
                </p>
                <p className="moduleText">{title}</p>
            </div>
        </Link>
    )
}