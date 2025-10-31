import { NavBar } from "../../components/layout/Navbar";
import "../Styles/UsuariosView.css";
import { useEffect, useState } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import { TiUserDelete, TiUserAdd } from "react-icons/ti";
import { getUsers } from "../../services/gesUsuario";
import { getRoles } from "../../services/rolesFuncs";
import type { usuario, rol } from "../../services/utils/models";
import { Link } from "react-router-dom";

export default function UsuariosIndex() {
  const [rolSelect, setRolSelect] = useState<number | "">("");
  const [nombre, setNombre] = useState("");
  const [rolesList, setRolesList] = useState<rol[]>([]);
  const [activo, setActivo] = useState<string | "">("");
  const [data, setData] = useState<usuario[]>([]);

  // ✅ Cargar usuarios y roles al inicio
  useEffect(() => {
    async function fetchData() {
      const users = await getUsers();
      const rolesDB = await getRoles();

      setData(users);
      setRolesList(rolesDB);
    }
    fetchData();
  }, []);

  // ✅ Aplicar filtros reales
  async function handleSearch() {
    const users = await getUsers(nombre, rolSelect, activo);
    setData(users);
  }

  return (
    <>
      <NavBar />
      <Link to={'/CreateOrEditUsuarios'}>
        <button className="filterButton">
          Crear usuarios
          <TiUserAdd/>
        </button>
      </Link>
      <div className="filtersContainer">
        <h2>Filtros</h2>
        <div className="container">
          {/* FILTRO NOMBRE */}
          <div className="filterFieldContainer">
            <label>Nombre del empleado</label>
            <input
              type="text"
              className="filterField"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* FILTRO ROL */}
          <div className="filterFieldContainer">
            <label>Rol</label>
            <select
              name="roles"
              id="rol"
              value={rolSelect}
              onChange={(e) =>
                setRolSelect(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="filterFieldSel"
            >
              <option value="">Todos...</option>
              {rolesList.map((r) => (
                <option key={r.rol_id} value={r.rol_id}>
                  {r.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* FILTRO ACTIVO */}
          <div className="filterFieldContainer">
            <label>Estado</label>
            <select
              value={activo}
              onChange={(e) => setActivo(e.target.value)}
              className="filterFieldSel"
            >
              <option value="">Todos</option>
              <option value="0">Activo</option>
              <option value="1">Inactivo</option>
            </select>
          </div>
        </div>

        <button className="filterButton" onClick={handleSearch}>
          Buscar <FaSearch />
        </button>
      </div>

      {/* TABLA */}
      <div className="tableContainer">
        <table className="usersTable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.usuario_id /* ✅ nombre real de tu PK */}>
                <td>
                  {item.nombre_1} {item.apellido_1} {item.apellido_2}
                </td>
                <td>{item.usuario}</td>
                <td>{item.rol.descripcion}</td>
                <td>{item.activo ? "Sí" : "No"}</td>
                <td className="userTableActions">
                  <button className="actionButton">
                    <FaEdit color="#4287f5" />
                  </button>
                  <button className="actionButton">
                    <TiUserDelete color="#f54242" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
