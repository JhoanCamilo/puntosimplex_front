import { useState, useEffect } from "react";
import type { rol } from "../../services/utils/models";
import { NavBar } from "../../components/layout/Navbar";
import { getRoles } from "../../services/rolesFuncs";
import { SimpleInput, ReadOnlyInput } from "../../components/Inputs/formInputs";
import { toast } from "react-toastify";
import { createUser, generarAliasUnicoFront } from "../../services/gesUsuario";
import { useDebounce } from "../../hooks/useDebounce";
import "../Styles/UsuariosView.css";

export default function CreateUsers() {
  const [rolSelect, setRolSelect] = useState<number | "">("");
  const [rolesList, setRolesList] = useState<rol[]>([]);

  const [nombre1, setNombre1] = useState<string>("");
  const [nombre2, setNombre2] = useState<string>("");
  const [apellido1, setApellido1] = useState<string>("");
  const [apellido2, setApellido2] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [usuario, setUsuario] = useState<string>("");
  const [tempPass, setTempPass] = useState<string>("");

  // valores con debounce
  const debouncedNombre1 = useDebounce(nombre1);
  const debouncedNombre2 = useDebounce(nombre2);
  const debouncedApellido1 = useDebounce(apellido1);

  // ✅ Cargar roles
  useEffect(() => {
    async function fetchData() {
      const selectRolesOpts = await getRoles();
      setRolesList(selectRolesOpts);
    }
    fetchData();
  }, []);

  // ✅ Generar alias + contraseña temporal
  useEffect(() => {
    async function generarUsuarioFinal() {
      if (!debouncedNombre1.trim() || !debouncedApellido1.trim()) {
        setUsuario("");
        return;
      }

      const n1 = debouncedNombre1.trim().toUpperCase();
      const n2 = debouncedNombre2.trim().toUpperCase();
      const a1 = debouncedApellido1.trim().toUpperCase();

      let aliasBase = "";

      if (!n2) {
        aliasBase = n1.substring(0, 3) + a1;
      } else {
        aliasBase = n1.charAt(0) + n2.charAt(0) + a1;
      }

      // ✅ Consultar alias único con debounce
      const aliasFinal = await generarAliasUnicoFront(aliasBase);

      setUsuario(aliasFinal);
    }

    function generarContrasenaTemporal() {
      const mayus = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const minus = "abcdefghijklmnopqrstuvwxyz";
      const nums = "0123456789";

      const c1 = mayus[Math.floor(Math.random() * mayus.length)];
      const c2 = minus[Math.floor(Math.random() * minus.length)];
      const c3 = nums[Math.floor(Math.random() * nums.length)];

      const all = mayus + minus + nums;
      let extra = "";
      for (let i = 0; i < 6; i++) {
        extra += all[Math.floor(Math.random() * all.length)];
      }

      const finalPass = (c1 + c2 + c3 + extra)
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

      setTempPass(finalPass);
    }

    generarUsuarioFinal();
    generarContrasenaTemporal();
  }, [debouncedNombre1, debouncedNombre2, debouncedApellido1]);

  // ✅ Crear usuario
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();

    const response = await createUser({
      nombre_1: nombre1,
      nombre_2: nombre2 || undefined,
      apellido_1: apellido1,
      apellido_2: apellido2 || undefined,
      usuario: usuario,
      correo: email,
      rol_id: rolSelect as number,
      tempPass: tempPass,
    });

    if (response.status === 200) {
      toast.success("✅ Usuario creado correctamente");
    } else {
      toast.error("❌ Error: " + response.message);
    }
  }

  return (
    <form onSubmit={handleCreateUser}>
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
                required
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
                required
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
              required
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
                required
                value={rolSelect}
                onChange={(e) =>
                  setRolSelect(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              >
                <option value="">Seleccione un rol...</option>
                {rolesList.map((r) => (
                  <option key={r.rol_id} value={r.rol_id}>
                    {r.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <ReadOnlyInput
              label="Contraseña temporal"
              type="text"
              value={tempPass}
            />
          </div>
        </div>

        <button className="newUserBtn" type="submit">
          Crear Usuario
        </button>
      </div>
    </form>
  );
}
