import React, { useState } from "react"
import "../styles/inputStyles.css"
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface inputProps{
    title: string,
    onValueChange: (value: string) => void; // Función para devolver el valor del input
    type?: string; // Opcional: tipo de input (text, number, email, etc.)
    value?: string; // Opcional: para controlar el valor externamente
}

interface PassInputProps{
    title: string,
    onValueChange: (value: string) => void; // Función para devolver el valor del input
    type?: string; // Opcional: tipo de input (text, number, email, etc.)
    value?: string; // Opcional: para controlar el valor externamente
}

export const SimpleLoginInput: React.FC<inputProps> = ({title, onValueChange, type, value}) => {
    return(
        <div className="inputContainer">
            <label className="inputLabel">{title}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className="inputText"
            />
        </div>
    )
}

export const PasswordLoginInput: React.FC<PassInputProps> = ({title, onValueChange, value}) => {
    const [show, setShow] = useState<boolean>();
    function showHide() {
        setShow(!show)
    }
    return(
        <div className="inputContainer">
            <label className="inputLabel">{title}</label>
            <div className="inputAreaContainer">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    className="passInputText"
                />
                <button className="showHidePass" onClick={showHide}>{show ? <FaEyeSlash/> : <FaEye/>}</button>
            </div>
        </div>
    )
}