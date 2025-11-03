import React from "react";
import "../styles/inputStyles.css";

interface simpleInputProps {
  label: string;
  type: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  value?: string;
  required?: boolean;
  disable?: boolean;
  readonly?: boolean;
}

interface readOnlyInputProps {
  label: string;
  type: string;
  value?: string;
}

interface checkInputProps{
  label: string
  value?: boolean
  onValueChange: (val: boolean) => void
}

export const SimpleInput: React.FC<simpleInputProps> = ({
  label,
  type,
  placeholder,
  onValueChange,
  value,
  required,
  disable,
  readonly
}) => {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val: any = e.target.value;

    // ✅ Si el input es number → convertirlo
    if (type === "number") {
      val = e.target.value === "" ? "" : Number(e.target.value);
    }

    onValueChange(val);
  }

  return (
    <div className="simpleInputContainer">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="inputText"
        required={required}
        disabled={disable}
        readOnly={readonly}
      />
    </div>
  );
};


export const ReadOnlyInput: React.FC<readOnlyInputProps> = ({
  label,
  type,
  value,
}) => {
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


export const ActivoCheckbox: React.FC<checkInputProps> = ({
  label = "Activo",
  value,
  onValueChange,
}) => {
  function handleChange() {
    // Si estaba activo y quieren desactivarlo → pedir confirmación
    if (value === true) {
      const confirmar = window.confirm(
        "¿Seguro que deseas deshabilitar este producto?"
      );

      if (!confirmar) {
        return; // Usuario canceló, no cambiar valor
      }
    }

    // Cambiar estado normalmente
    onValueChange(!value);
  }

  return (
    <div className="activoCheckboxContainer">
      <label>{" "}{label}</label>
        <input
          type="checkbox"
          checked={value}
          onChange={handleChange}
        />
    </div>
  );
};