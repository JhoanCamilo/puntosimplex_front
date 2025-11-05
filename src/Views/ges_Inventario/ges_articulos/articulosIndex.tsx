import { NavBar } from "../../../components/layout/Navbar";
import { SimpleInput } from "../../../components/Inputs/formInputs";
import { useEffect, useState } from "react";
import type { categoria, producto } from "../../../services/utils/models";
import { getCategorias } from "../../../services/gesCategorias";
import { getArticulos } from "../../../services/gesArticulos";
import "../inventoryStyles.css";
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
      const selectRolesOpts = await getCategorias();
      const listaProductos = await getArticulos();
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
      <div className="viewContainer">
        <Link to={"/ArticulosCrear"}>
          <button className="filterButton">Crear producto</button>
        </Link>
        <div>
          <h2 style={{marginLeft: "15px"}}>Filtros</h2>
          <div className="filterCategoryContainer">
            <SimpleInput
              label="Descripción"
              type="text"
              value={itemDesc}
              onValueChange={setItemDesc}
            />
            <div className="userRoleSelectContainer">
              <p>Categoría</p>
              <select
                id="productCat"
                className="productCategorySelect"
                required
                value={catSelect}
                onChange={(e) =>
                  setCatSelect(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              >
                <option value="">Seleccione una categoría...</option>
                {categoriasList.map((r) => (
                  <option key={r.categoria_id} value={r.categoria_id}>
                    {r.descripcion}
                  </option>
                ))}
              </select>
              {/* FILTRO ACTIVO */}
            </div>
              <div className="filterFieldContainer">
                <label>Estado</label>
                <select
                  value={activo}
                  onChange={(e) => setActivo(e.target.value)}
                  className="productCategorySelect"
                >
                  <option value="">Todos</option>
                  <option value="0">Activo</option>
                  <option value="1">Inactivo</option>
                </select>
              </div>
          </div>
          <button className="filterCatButton" onClick={handleSearch}>
            Buscar <FaSearch />
          </button>
        </div>
        {/* TABLA */}
        <div className="tableContainer">
          <table className="productsTable">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Precio Compra</th>
                <th>Precio Venta</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Cant. Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosList.map((item) => (
                <tr key={item.articulo_id}>
                  <td>{item.descripcion}</td>
                  <td>{item.valor_unitario}</td>
                  <td>{item.precio}</td>
                  <td>{item.categoria.descripcion}</td>
                  <td>{item.activo ? "Activo" : "Inactivo"}</td>
                  <td>0</td>
                  <td className="productTableActions">
                    <Link to={`/ArticuloEditar/${item.articulo_id}`}>
                      <button className="actionButton">
                        <FaEdit color="#4287f5" />
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
