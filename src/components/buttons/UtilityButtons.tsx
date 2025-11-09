import React from "react";
import "../styles/buttonStyles.css"
import { IoIosArrowBack } from "react-icons/io";

export const ReturnButton : React.FC = () => {
    return(
        <button className="returnBtn" onClick={() => {history.go(-1)}}>
            <IoIosArrowBack/>
        </button>
    )
}