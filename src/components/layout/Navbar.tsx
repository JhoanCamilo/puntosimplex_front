import type React from "react";
import PSLogo from '../../assets/puntoLogo.png'
import '../styles/layout.css'

export const NavBar : React.FC = () => {
    const userJsonString = localStorage.getItem("user");
    let username : string = ""

    if (userJsonString) {
        try {
            const userObject = JSON.parse(userJsonString);

            username = userObject.username;
            
            console.log("Nombre de usuario extraído:", username);

        } catch (e) {
            console.error("Error al convertir la cadena a JSON:", e);
        }
    } else {
        console.log("La clave 'user' no está en localStorage.");
    }
    
    return(
        <div className="navBarContainer">
            <div>
                <img src={PSLogo} alt="Punto_Simplex_Logo" className="navBar_logo"/>
            </div>
            <div className="linkContainer">
                <p className="Banner">Bienvenido {username}</p>
            </div>
        </div>
    )
}