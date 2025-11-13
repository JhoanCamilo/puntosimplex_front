import { useState, useEffect } from "react";
import { type rol } from "../../services/utils/models";
import { NavBar } from "../../components/layout/Navbar";
import { getRoles } from "../../services/rolesFuncs";
import {
  SimpleInput,
  ReadOnlyInput,
  ActivoCheckbox,
} from "../../components/Inputs/formInputs";
import { toast } from "react-toastify";
import { getUsuarioById, updateUsuario } from "../../services/gesUsuario";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUsers() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rolesList, setRolesList] = useState<rol[]>([]);
  const [rolSelect, setRolSelect] = useState<number | "">("");

  const [nombre1, setNombre1] = useState<string>("");
  const [nombre2, setNombre2] = useState<string>("");
  const [apellido1, setApellido1] = useState<string>("");
  const [apellido2, setApellido2] = useState<string>("");

  const [correo, setCorreo] = useState<string>("");
  const [usuario, setUsuario] = useState<string>("");

  const [activo, setActivo] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      const roles = await getRoles();
      setRolesList(roles);

      const result = await getUsuarioById(id!);

      if (result.status === 200) {
        const u = result.data;

        setNombre1(u.nombre_1);
        setNombre2(u.nombre_2 || "");
        setApellido1(u.apellido_1);
        setApellido2(u.apellido_2 || "");
        setCorreo(u.correo);
        setUsuario(u.usuario);
        setRolSelect(u.rol_id);
        setActivo(u.activo);
      } else {
        toast.error(result.message);
      }
    }

    load();
  }, []);

  const isFormValid =
    correo.trim() !== "" && usuario.trim() !== "" && rolSelect !== "";

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    console.log("Saving user...", Number(id));

    const response = await updateUsuario(Number(id), {
      usuario,
      correo,
      rol_id: rolSelect as number,
      activo,
    });

    console.log("Response update:", response);

    if (response.status === 200) {
      alert("Usuario correctamente actualizado.");
      setTimeout(() => navigate("/GestionUsuarios"), 800);
    } else {
      alert(response.message);
    }
  }

  return (
    <form onSubmit={handleUpdate}>
      <NavBar />

      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            marginTop: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          Editar usuario
        </h2>

        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #eee",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
            {/* ----------- COLUMNA IZQUIERDA ----------- */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h3>Información personal</h3>

              <ReadOnlyInput
                label="Primer nombre"
                type="text"
                value={nombre1}
              />
              <ReadOnlyInput
                label="Segundo nombre"
                type="text"
                value={nombre2}
              />
              <ReadOnlyInput
                label="Primer apellido"
                type="text"
                value={apellido1}
              />
              <ReadOnlyInput
                label="Segundo apellido"
                type="text"
                value={apellido2}
              />

              {/* Correo editable */}
              <SimpleInput
                label="Correo electrónico"
                type="email"
                value={correo}
                onValueChange={setCorreo}
                required
              />
            </div>

            {/* ----------- COLUMNA DERECHA ----------- */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h3>Perfil usuario</h3>

              {/* Alias editable */}
              <SimpleInput
                label="Usuario"
                type="text"
                value={usuario}
                onValueChange={setUsuario}
                required
              />

              {/* Rol */}
              <div style={{ marginTop: "15px" }}>
                <label>Rol del usuario</label>
                <select
                  value={rolSelect}
                  onChange={(e) =>
                    setRolSelect(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    height: "38px",
                  }}
                  required
                >
                  <option value="">Seleccione un rol...</option>
                  {rolesList.map((r) => (
                    <option key={r.rol_id} value={r.rol_id}>
                      {r.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div style={{ marginTop: "20px" }}>
                <ActivoCheckbox
                  label="Activo"
                  value={activo}
                  confirmMessage="¿Seguro que deseas deshabilitar este usuario?"
                  onValueChange={setActivo}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          style={{
            backgroundColor: isFormValid ? "#007bff" : "#cccccc",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            marginTop: "20px",
            border: "none",
            cursor: isFormValid ? "pointer" : "not-allowed",
            fontSize: "16px",
          }}
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}
