import "./Styles/LoginView.css"
import { SimpleLoginInput, PasswordLoginInput } from "../components/Inputs/LoginInputs"
import { LoginButton } from "../components/buttons/LoginButton"
import logoImage from "../assets/puntoLogo.png"
import { useEffect, useState } from "react"
import { LoginFunction } from "../services/LoginFunc"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginView() {
    const [user, setUser] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [disaBtn, setDisaBtn] = useState<boolean>(true)

    useEffect(() => {
        if (user.trim() !== "" && pass.trim() !== "") {
        setDisaBtn(false);
        } else {
        setDisaBtn(true);
        }
    }, [user, pass]);

    async function login() {
        console.log("Usuario: ", user)
        console.log("Constraseña: ", pass)

        const result = await LoginFunction(user, pass);

        if (result.status === 200) {
            toast.success(result.message, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        } else {
            toast.warn(result.message, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        }
    }

    return(
        <div className="ViewContainer">
            <div className="formContainer">
                <img src={logoImage} alt="Logo_PuntoSimplex" />
                <SimpleLoginInput title="Usuario" value={user} onValueChange={setUser}/>
                <PasswordLoginInput title="Contraseña" value={pass} onValueChange={setPass}/>
                <LoginButton LoginFunction={login} disabledBtn = {disaBtn}/>
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                draggable
            />
        </div>
    )
}