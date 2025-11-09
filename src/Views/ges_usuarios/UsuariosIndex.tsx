import { NavBar } from "../../components/layout/Navbar";
import { useEffect, useState } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import { TiUserDelete, TiUserAdd } from "react-icons/ti";
import { getUsers } from "../../services/gesUsuario";
import { getRoles } from "../../services/rolesFuncs";
import { type usuario, type rol } from "../../services/utils/models"; 
import { Link } from "react-router-dom";

export default function UsuariosIndex() {
  const [rolSelect, setRolSelect] = useState<number | "">("");
  const [nombre, setNombre] = useState("");
  const [rolesList, setRolesList] = useState<rol[]>([]);
  const [activo, setActivo] = useState<string | "">("");
  const [data, setData] = useState<usuario[]>([]);

  
  useEffect(() => {
    async function fetchData() {
      const users = await getUsers("", "", ""); // Carga inicial
      const rolesDB = await getRoles();

      setData(users);
      setRolesList(rolesDB);
    }
    fetchData();
  }, []);

 
  async function handleSearch() {
    const users = await getUsers(nombre, rolSelect, activo);
    setData(users);
  }

  return (
    <>
      <NavBar />
      {/* Contenedor principal  */}
      <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Botón Crear Usuario  */}
        <Link to={"/CreateOrEditUsuarios"}>
          <button style={{
            backgroundColor: "#007bff", // Azul
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}>
            Crear usuarios
            <TiUserAdd size={20} />
          </button>
        </Link>
        
        {/* Filtros  */}
        <div>
          <h2 style={{ marginLeft: "15px", marginTop: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Filtros</h2>
          {/* Contenedor gris de filtros */}
          <div style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-end",
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            flexWrap: "wrap"
          }}>
            
            {/* FILTRO NOMBRE  */}
            <div style={{ fontFamily: "sans-serif" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Nombre del empleado</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{ width: "200px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", height: "20px" }}
              />
            </div>

            {/* FILTRO ROL  */}
            <div style={{ fontFamily: "sans-serif" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Rol</label>
              <select
                name="roles"
                id="rol"
                value={rolSelect}
                onChange={(e) =>
                  setRolSelect(e.target.value === "" ? "" : Number(e.target.value))
                }
                style={{ width: "200px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", height: "38px" }}
              >
                <option value="">Todos...</option>
                {rolesList.map((r) => (
                  <option key={r.rol_id} value={r.rol_id}>
                    {r.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* FILTRO ACTIVO  */}
            <div style={{ fontFamily: "sans-serif" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Estado</label>
              <select
                value={activo}
                onChange={(e) => setActivo(e.target.value)}
                style={{ width: "200px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", height: "38px" }}
              >
                <option value="">Todos</option>
                <option value="0">Activo</option>
                <option value="1">Inactivo</option>
              </select>
            </div>
            
            {/* Botón de Búsqueda  */}
            <button onClick={handleSearch} style={{
              backgroundColor: "#28a745", // Verde
              color: "white",
              border: "none",
              padding: "0 15px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              height: "38px"
            }}>
              Buscar <FaSearch />
            </button>
          </div>
        </div>

        {/* Tabla  */}
        <div style={{ marginTop: "30px", overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "sans-serif",
            border: "1px solid #ddd"
          }}>
            <thead>
              {/* Cabecera lila */}
              <tr style={{ borderBottom: "2px solid #ddd", backgroundColor: "#f4f7ff" }}>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Nombre</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Usuario</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Rol</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Activo</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.usuario_id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {item.nombre_1} {item.apellido_1} {item.apellido_2}
                  </td>
                  <td style={{ padding: "12px", border: "1x solid #ddd" }}>{item.usuario}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.rol.descripcion}</td>
                  
                  {/* Pastilla de estado */}
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: item.activo ? "#155724" : "#721c24",
                      backgroundColor: item.activo ? "#d4edda" : "#f8d7da"
                    }}>
                      {item.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  
                  {/* Botones de Acción */}
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center", display: "flex", gap: "10px" }}>
                    
                    <Link to={`/EditUsuarios/${item.usuario_id}`}>
                      <button style={{ border: "none", backgroundColor: "transparent", cursor: "pointer", padding: "5px" }}>
                        <FaEdit color="#007bff" /> {/* Azul */}
                      </button>
                    </Link>
                    <button style={{ border: "none", backgroundColor: "transparent", cursor: "pointer", padding: "5px" }}>
                      <TiUserDelete color="#dc3545" /> {/* Rojo */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
