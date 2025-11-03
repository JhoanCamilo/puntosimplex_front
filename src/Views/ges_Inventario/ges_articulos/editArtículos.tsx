import { NavBar } from "../../../components/layout/Navbar";
import { SimpleInput } from "../../../components/Inputs/formInputs";
import { useEffect, useState } from "react";
import type { categoria } from "../../../services/utils/models";
import { getCategorias } from "../../../services/gesCategorias";
import { ActivoCheckbox } from "../../../components/Inputs/formInputs";
import {
  getArticuloById,
  updateArticulo,
} from "../../../services/gesArticulos";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "../inventoryStyles.css";

export default function ArticulosEdit() {
  const [itemDesc, setItemDesc] = useState<string>("");
  const [precioCompra, setPrecioCompra] = useState<number | "">("");
  const [precioVenta, setPrecioVenta] = useState<number | "">("");
  const [catSelect, setCatSelect] = useState<number | "">("");
  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);
  const [activo, setActivo] = useState<boolean>(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const result = await getArticuloById(Number(id));
      const selectRolesOpts = await getCategorias();
      setCategoriasList(selectRolesOpts);

      if (result.status === 200) {
        console.log(result);
        setItemDesc(result.data.descripcion);
        setPrecioCompra(result.data.valor_unitario);
        setPrecioVenta(result.data.precio);
        setActivo(result.data.activo);
        setCatSelect(result.data.categoria_id);
      }
    }
    load();
  }, []);

  // ✅ Validación del formulario
  const isFormValid =
    itemDesc.trim() !== "" &&
    precioCompra !== "" &&
    precioVenta !== "" &&
    catSelect !== "";

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault(); // ✅ evita que el formulario provoque navigation automática

    const response = await updateArticulo(Number(id), {
      descripcion: itemDesc,
      valor_unitario: Number(precioCompra),
      precio: Number(precioVenta),
      categoria_id: Number(catSelect),
      activo: activo,
    });

    if (response.status === 200) {
      toast.success(response.message);

      setTimeout(() => navigate("/Articulos"), 800); // ✅ ahora sí se verá el toast
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

            <div className="userCatSelectContainer">
              <div>
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
              </div>
              <ActivoCheckbox
                label="Estado"
                value={activo}
                onValueChange={setActivo}
              />
            </div>
          </div>

          <button
            className="filterCatButton"
            disabled={!isFormValid}
            onClick={handleUpdate}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}
