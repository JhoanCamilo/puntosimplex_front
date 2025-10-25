import React from "react";
import "../styles/buttonStyles.css"

interface LoginButton{
    LoginFunction: () => void
    disabledBtn: boolean
}

export const LoginButton: React.FC<LoginButton> = ({LoginFunction, disabledBtn}) => {
    return(
        <button onClick={LoginFunction} className="loginButton" disabled = {disabledBtn}>
            Ingresar
        </button>
    )
}