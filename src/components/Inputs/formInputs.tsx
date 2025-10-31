import React from "react";
import "../styles/inputStyles.css"

interface simpleInputProps {
  label: string;
  type: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  value?: string;
  required?: boolean
  disable?: boolean
  readonly?: boolean
}

interface readOnlyInputProps {
  label: string;
  type: string;
  value?: string;
}

export const SimpleInput: React.FC<simpleInputProps> = ({label, type, placeholder, onValueChange, value, required, disable, readonly}) => {
  return (
    <div className="simpleInputContainer">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
        className="inputText"
        required={required}
        disabled={disable}
        readOnly={readonly}
      />
    </div>
  );
};

export const ReadOnlyInput: React.FC<readOnlyInputProps> = ({label, type, value}) => {
  return (
    <div className="simpleInputContainer">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        className="inputText"
        readOnly
        disabled
      />
    </div>
  );
};
