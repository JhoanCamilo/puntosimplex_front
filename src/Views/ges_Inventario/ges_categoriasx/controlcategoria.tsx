import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavBar } from "../../../components/layout/Navbar";
import { SimpleInput } from "../../../components/Inputs/formInputs";
import { type categoria } from "../../../services/utils/models";
import { getCategorias } from "../../../services/gesCategorias";
import "../inventoryStyles.css";
import { FaEdit } from "react-icons/fa"; 
import { useDebounce } from "../../../hooks/useDebounce"; 

export default function ControlCategoria() {
  const [filtroDesc, setFiltroDesc] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string>(""); // "0" (Activo), "1" (Inactivo), "" (Todos)
  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);

  const debouncedDesc = useDebounce(filtroDesc, 300);

  // Carga inicial y búsqueda automática 
  useEffect(() => {
    async function handleSearch() {
      // Usamos el valor "debounced" para la descripción
      const categories = await getCategorias(debouncedDesc, filtroEstado);
      setCategoriasList(categories);
    }
    handleSearch();
  }, [debouncedDesc, filtroEstado]); 

  return (
    <>
      <NavBar />

      {/* className="viewContainer" */}
      <div
        style={{
          padding: "20px",
          fontFamily: "sans-serif",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div>
          {/* className="filterCategoryContainer" */}
          <h2
            style={{
              marginLeft: "15px",
              marginTop: "20px",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
            }}
          >
            Filtros
          </h2>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-end",
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
              flexWrap: "wrap",
            }}
          >
            {/* Filtro Descripción */}
            <SimpleInput
              label="Descripción"
              type="text"
              value={filtroDesc}
              onValueChange={setFiltroDesc} // Se actualiza al escribir
            />

            {/* Filtro Estado */}
            {/* className="filterFieldContainer" */}
            <div style={{ fontFamily: "sans-serif" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Estado
              </label>
              {/* className="productCategorySelect" */}
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)} // Se actualiza al cambiar
                style={{
                  width: "200px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  height: "38px",
                }}
              >
                <option value="">Todos</option>
                <option value="0">Activo</option>
                <option value="1">Inactivo</option>
              </select>
            </div>

            {/* --- Botón de Búsqueda de momento se quita porque ya tus sabes--- */}
          </div>
        </div>

        {/* --- Tabla --- */}
        {/* className="tableContainer" */}
        <div style={{ marginTop: "30px", overflowX: "auto" }}>
          {/* className="productsTable" */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "sans-serif",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid #ddd",
                  backgroundColor: "#f4f4ff",
                }}
              >
                {/* --- Columnas de la Tarea --- */}
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                  }}
                >
                  Descripción
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                  }}
                >
                  Estado
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                  }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {categoriasList.length > 0 ? (
                categoriasList.map((item) => (
                  <tr
                    key={item.categoria_id}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td
                      style={{ padding: "12px", border: "1px solid #ddd" }}
                    >
                      {item.descripcion}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #ddd" }}
                    >
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          color: item.activo ? "#155724" : "#721c24",
                          backgroundColor: item.activo
                            ? "#d4edda"
                            : "#f8d7da",
                        }}
                      >
                        {item.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    {/* --- Acciones --- */}
                    {/* className="productTableActions" */}
                    <td
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      <Link to={`/CategoriaEditar/${item.categoria_id}`}>
                        {/* className="actionButton" */}
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            padding: "5px",
                          }}
                        >
                          <FaEdit />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      border: "1px solid #ddd",
                    }}
                  >
                    No se encontraron categorías.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

