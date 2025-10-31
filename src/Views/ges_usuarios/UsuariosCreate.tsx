import { useState, useEffect } from "react";
import type { rol } from "../../services/utils/models";
import { NavBar } from "../../components/layout/Navbar";
import { getRoles } from "../../services/rolesFuncs";
import { SimpleInput, ReadOnlyInput } from "../../components/Inputs/formInputs";
import "../Styles/UsuariosView.css"

export default function CreateUsers() {
  const [rolSelect, setRolSelect] = useState<number | "">("");
  const [rolesList, setRolesList] = useState<rol[]>([]);
  const [nombre1, setNombre1] = useState<string>();
  const [nombre2, setNombre2] = useState<string>();
  const [apellido1, setApellido1] = useState<string>();
  const [apellido2, setApellido2] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [usuario, setUsuario] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      const selectRolesOpts = await getRoles();
      setRolesList(selectRolesOpts);
    }
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="viewContainer">
        <h2>Crear usuarios</h2>
        <div className="createOrEditInfoContainer">
          <div className="personalInfoContainer">
            <h3>Información personal</h3>
            <div className="nombreEmpleado">
              <SimpleInput
                label="Primer Nombre"
                placeholder="Primer nombre del empleado"
                type="text"
                value={nombre1}
                onValueChange={setNombre1}
                required={true}
              />
              <SimpleInput
                label="Segundo Nombre"
                placeholder="Segundo nombre del empleado"
                type="text"
                value={nombre2}
                onValueChange={setNombre2}
              />
            </div>
            <div className="nombreEmpleado">
              <SimpleInput
                label="Primer Apellido"
                placeholder="Primer apellido del empleado"
                type="text"
                value={apellido1}
                onValueChange={setApellido1}
              />
              <SimpleInput
                label="Segundo Apellido"
                placeholder="Segundo apellido del empleado"
                type="text"
                value={apellido2}
                onValueChange={setApellido2}
              />
            </div>
            <SimpleInput
              label="Correo electrónico"
              placeholder="example@example.com"
              type="email"
              value={email}
              onValueChange={setEmail}
              required={true}
            />
          </div>
          <div className="personalInfoContainer">
            <h3>Perfil usuario</h3>
            <ReadOnlyInput label="Usuario" type="text" value={usuario} />
            <div className="userRoleSelectContainer">
              <p>Rol del usuario</p>
              <select
                id="userRole"
                className="userRoleSelect"
                value={rolSelect}
                onChange={(e) =>
                  setRolSelect(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              >
                <option value="">Todos...</option>
                {rolesList.map((r) => (
                  <option key={r.rol_id} value={r.rol_id}>
                    {r.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
