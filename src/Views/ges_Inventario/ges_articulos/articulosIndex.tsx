import { NavBar } from "../../../components/layout/Navbar";
import { SimpleInput } from "../../../components/Inputs/formInputs";
import { useEffect, useState } from "react";
import { type categoria, type producto } from "../../../services/utils/models";
import { getCategorias } from "../../../services/gesCategorias";
import { getArticulos } from "../../../services/gesArticulos";
// import "../inventoryStyles.css"; // Ya no es necesario, usamos estilos en línea
import { FaEdit, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ArticulosIndex() {
  const [itemDesc, setItemDesc] = useState<string>("");
  const [catSelect, setCatSelect] = useState<number | "">("");
  const [activo, setActivo] = useState<string | "">("");
  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);
  const [productosList, setProductosList] = useState<producto[]>([]);

  
  useEffect(() => {
    async function fetchData() {
      const selectRolesOpts = await getCategorias("", ""); // Llamada ajustada para traer todo
      const listaProductos = await getArticulos("", "", ""); // Carga inicial
      setCategoriasList(selectRolesOpts);
      setProductosList(listaProductos);
    }
    fetchData();
  }, []);

  
  async function handleSearch() {
    const products = await getArticulos(itemDesc, catSelect, activo);
    setProductosList(products);
  }

  return (
    <>
      <NavBar />
      {/* Contenedor principal  */}
      <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Botón Crear Artículo  */}
        <Link to={"/ArticulosCrear"}>
          <button style={{
            backgroundColor: "#007bff", // Azul
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginBottom: "20px"
          }}>
            Crear producto
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
            
            {/* Filtro Descripción */}
            <SimpleInput
              label="Descripción"
              type="text"
              value={itemDesc}
              onValueChange={setItemDesc}
            />

            {/* Filtro Categoría  */}
            <div style={{ fontFamily: "sans-serif" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Categoría</label>
              <select
                id="productCat"
                required
                value={catSelect}
                onChange={(e) =>
                  setCatSelect(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                // Estilo del select
                style={{ width: "200px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", height: "38px" }}
              >
                <option value="">Seleccione una categoría...</option>
                {categoriasList.map((r) => (
                  <option key={r.categoria_id} value={r.categoria_id}>
                    {r.descripcion}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtro Estado  */}
            <div style={{ fontFamily: "sans-serif" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Estado</label>
              <select
                value={activo}
                onChange={(e) => setActivo(e.target.value)}
                // Estilo del select
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
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Descripción</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Precio Compra</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Precio Venta</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Categoría</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Estado</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Cant. Disponible</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosList.map((item) => (
                <tr key={item.articulo_id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.descripcion}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.valor_unitario}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.precio}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.categoria.descripcion}</td>
                  
                  {/* Pastilla de estado  */}
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
                  
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>0</td>
                  
                  {/* Botón de Acción  */}
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                    <Link to={`/ArticuloEditar/${item.articulo_id}`}>
                      <button style={{
                        border: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        padding: "5px"
                      }}>
                        {/* Ícono azul */}
                        <FaEdit color="#007bff" />
                      </button>
                    </Link>
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