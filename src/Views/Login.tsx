import "./Styles/LoginView.css"
import { SimpleLoginInput, PasswordLoginInput } from "../components/Inputs/LoginInputs"
import { LoginButton } from "../components/buttons/LoginButton"
import logoImage from "../assets/puntoLogo.png"

export default function LoginView() {
    function login() {
        console.log("Hola wey")
    }

    return(
        <div className="ViewContainer">
            <div className="formContainer">
                <img src={logoImage} alt="Logo_PuntoSimplex" />
                <SimpleLoginInput title="Usuario"/>
                <PasswordLoginInput title="Contraseña"/>
                <LoginButton LoginFunction={login} disabledBtn = {false}/>
            </div>
        </div>
    )
}