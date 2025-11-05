import { useState, useEffect } from "react";
import { type rol } from "../../services/utils/models";
import { NavBar } from "../../components/layout/Navbar";
import { getRoles } from "../../services/rolesFuncs";
import { SimpleInput, ReadOnlyInput } from "../../components/Inputs/formInputs";
import { toast } from "react-toastify";
import { createUser, generarAliasUnicoFront } from "../../services/gesUsuario";
import { useDebounce } from "../../hooks/useDebounce";

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

  const debouncedNombre1 = useDebounce(nombre1);
  const debouncedNombre2 = useDebounce(nombre2);
  const debouncedApellido1 = useDebounce(apellido1);

  useEffect(() => {
    async function fetchData() {
      const selectRolesOpts = await getRoles();
      setRolesList(selectRolesOpts);
    }
    fetchData();
  }, []);

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

  const isFormValid =
    nombre1.trim() !== "" &&
    apellido1.trim() !== "" &&
    email.trim() !== "" &&
    rolSelect !== "";

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
    // <form> ahora envuelve todo
    <form onSubmit={handleCreateUser}>
      <NavBar />
      {/* Contenedor principal  */}
      <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ marginLeft: "15px", marginTop: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          Crear usuarios
        </h2>

        {/* Tarjeta gris para los campos  */}
        <div style={{
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #eee",
          marginTop: "20px"
        }}>
          {/* Contenedor Flex para las dos columnas */}
          <div style={{
            display: "flex",
            flexWrap: "wrap", // Para que sea responsivo en móviles
            gap: "40px" // Espacio entre columnas
          }}>

            {/* --- Columna Izquierda: Información Personal --- */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h3>Información personal</h3>
              
              {/* Nombres (en fila) */}
              <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <SimpleInput
                    label="Primer Nombre"
                    placeholder="Primer nombre"
                    type="text"
                    value={nombre1}
                    onValueChange={setNombre1}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <SimpleInput
                    label="Segundo Nombre"
                    placeholder="Segundo nombre"
                    type="text"
                    value={nombre2}
                    onValueChange={setNombre2}
                  />
                </div>
              </div>

              {/* Apellidos (en fila) */}
              <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <SimpleInput
                    label="Primer Apellido"
                    placeholder="Primer apellido"
                    type="text"
                    value={apellido1}
                    onValueChange={setApellido1}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <SimpleInput
                    label="Segundo Apellido"
                    placeholder="Segundo apellido"
                    type="text"
                    value={apellido2}
                    onValueChange={setApellido2}
                  />
                </div>
              </div>

              {/* Correo */}
              <div style={{ marginBottom: "15px" }}>
                <SimpleInput
                  label="Correo electrónico"
                  placeholder="example@example.com"
                  type="email"
                  value={email}
                  onValueChange={setEmail}
                  required
                />
              </div>
            </div>
            
            {/* --- Columna Derecha: Perfil Usuario --- */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h3>Perfil usuario</h3>
              
              <div style={{ marginBottom: "15px" }}>
                <ReadOnlyInput label="Usuario" type="text" value={usuario} />
              </div>
              
              <div style={{ marginBottom: "15px", fontFamily: "sans-serif" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Rol del usuario</label>
                <select
                  id="userRole"
                  required
                  value={rolSelect}
                  onChange={(e) =>
                    setRolSelect(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  // Estilo del select
                  style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", height: "38px" }}
                >
                  <option value="">Seleccione un rol...</option>
                  {rolesList.map((r) => (
                    <option key={r.rol_id} value={r.rol_id}>
                      {r.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <ReadOnlyInput
                  label="Contraseña temporal"
                  type="text"
                  value={tempPass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Crear  */}
        <button
          type="submit"
          disabled={!isFormValid}
          style={{
            backgroundColor: isFormValid ? "#007bff" : "#cccccc", // Azul (o gris si está deshabilitado)
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: isFormValid ? "pointer" : "not-allowed",
            fontSize: "16px",
            marginTop: "20px"
          }}
        >
          Crear Usuario
        </button>
      </div>
    </form>
  );
}
