import { NavBar } from "../../../components/layout/Navbar";
import { SimpleInput } from "../../../components/Inputs/formInputs";
import { useEffect, useState } from "react";
import type { categoria } from "../../../services/utils/models";
import { getCategorias } from "../../../services/gesCategorias";
import "../inventoryStyles.css";
import { FaSearch } from "react-icons/fa";

export default function ArticulosIndex() {
  const [itemDesc, setItemDesc] = useState<string>("");
  const [catSelect, setCatSelect] = useState<number | "">("");
  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);

  useEffect(() => {
    async function fetchData() {
      const selectRolesOpts = await getCategorias();
      setCategoriasList(selectRolesOpts);
    }
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="viewContainer">
        <div>
          <h2>Filtros</h2>
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
            </div>
          </div>
          <button className="filterCatButton">
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
          </table>
        </div>
      </div>
    </>
  );
}
