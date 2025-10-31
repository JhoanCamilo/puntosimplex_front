import { NavBar } from "../../components/layout/Navbar"
import "../Styles/UsuariosView.css"
import { useState } from "react"
import { roles } from "../../services/utils/filters"
import { usuarios } from "../../services/utils/dataSimulation"
import { FaSearch, FaEdit } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";

export default function UsuariosIndex (){
    const [rol, setRol] = useState<number | "">("")
    return (
      <>
        <NavBar />
        <div className="filtersContainer">
          <h2>Filtros</h2>
          <div className="container">
            <div className="filterFieldContainer">
                <label>Nombre del empleado</label>
                <input type="text" id="empleado" className="filterField" />
            </div>
            <div className="filterFieldContainer">
                <label>Rol</label>
                <select
                name="roles"
                id="rol"
                value={rol}
                onChange={(e) => setRol(Number(e.target.value))}
                className="filterFieldSel"
                >
                    <option value="">Todos...</option>
                {roles.map((r) => (
                    <option key={r.rolid} value={r.rolid}>
                    {r.descripcion}
                    </option>
                ))}
                </select>
            </div>
            <div className="filterFieldContainer">
                <label>Estado</label>
                <select name="estado" id="estados" className="filterFieldSel">
                    <option value="">Todos</option>
                    <option value="0">Activo</option>
                    <option value="1">Inactivo</option>
                </select>
            </div>
          </div>
          <button className="filterButton">Buscar <FaSearch /></button>
        </div>
        <div className="tableContainer">
            <table className="usersTable">
                <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
                {
                    usuarios.map((item) => (
                        <tr key={item.usuarioid}>
                            <td>{item.nombre_1 + " " + item.apellido_2 + " " + item.apellido_1 + " " + item.apellido_2}</td>
                            <td>{item.rolid}</td>
                            <td>{item.activo ? "Si" : "No"}</td>
                            <td className="userTableActions">
                                <button className="actionButton"><FaEdit color="#4287f5"/></button>
                                <button className="actionButton"><TiUserDelete color="#f54242"/></button>
                            </td>
                        </tr>
                    ))
                }
            </table>
        </div>
      </>
    );
}