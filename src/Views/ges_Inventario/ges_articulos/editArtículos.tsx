import { NavBar } from "../../../components/layout/Navbar";
import { SimpleInput } from "../../../components/Inputs/formInputs";
import { useEffect, useState } from "react";
import type { categoria } from "../../../services/utils/models";
import { getCategorias } from "../../../services/gesCategorias";
import { crearArticulo } from "../../../services/gesArticulos";
import { ActivoCheckbox } from "../../../components/Inputs/formInputs";
import { toast } from "react-toastify";
import "../inventoryStyles.css";

export default function ArticulosEdit() {
  const [itemDesc, setItemDesc] = useState<string>("");
  const [precioCompra, setPrecioCompra] = useState<number | "">("");
  const [precioVenta, setPrecioVenta] = useState<number | "">("");
  const [catSelect, setCatSelect] = useState<number | "">("");
  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);
  const [activo, setActivo] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      const selectRolesOpts = await getCategorias();
      setCategoriasList(selectRolesOpts);
    }
    fetchData();
  }, []);

  // ✅ Validación del formulario
  const isFormValid =
    itemDesc.trim() !== "" &&
    precioCompra !== "" &&
    precioVenta !== "" &&
    catSelect !== "";

  // ✅ Crear artículo
  async function handleCreate() {
    const response = await crearArticulo({
      descripcion: itemDesc,
      valor_unitario: Number(precioCompra),
      precio: Number(precioVenta),
      categoria_id: catSelect as number,
    });

    if (response.status === 200) {
      toast.success(response.message);
      // Reset opcional
      setItemDesc("");
      setPrecioCompra("");
      setPrecioVenta("");
      setCatSelect("");
    } else {
      toast.error(response.message);
    }
  }

  return (
    <>
      <NavBar />
      <div className="viewContainer">
        <div>
          <h2>Editar artículo</h2>

          <div className="createFieldsContainer">
            <SimpleInput
              label="Descripción"
              type="text"
              value={itemDesc}
              onValueChange={setItemDesc}
            />

            <SimpleInput
              label="Valor de compra"
              type="number"
              value={precioCompra}
              onValueChange={(val) =>
                setPrecioCompra(val === "" ? "" : Number(val))
              }
            />

            <SimpleInput
              label="Valor de venta"
              type="number"
              value={precioVenta}
              onValueChange={(val) =>
                setPrecioVenta(val === "" ? "" : Number(val))
              }
            />

            <div className="userRoleSelectContainer">
              <p>Categoría</p>
              <select
                id="productCat"
                className="productCategorySelect"
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
              <ActivoCheckbox label="Estado" value={activo} onValueChange={setActivo}/>
            </div>
          </div>

          <button
            className="filterCatButton"
            disabled={!isFormValid}
            onClick={handleCreate}
          >
            Crear
          </button>
        </div>
      </div>
    </>
  );
}