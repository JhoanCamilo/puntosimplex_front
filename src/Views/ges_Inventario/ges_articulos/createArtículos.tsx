import { NavBar } from "../../../components/layout/Navbar";
import { SimpleInput } from "../../../components/Inputs/formInputs";
import { useEffect, useState } from "react";
import type { categoria } from "../../../services/utils/models";
import { getCategorias } from "../../../services/gesCategorias";
import { crearArticulo } from "../../../services/gesArticulos";
import { toast } from "react-toastify";
import "../inventoryStyles.css";

export default function ArticulosCreate() {
  const [itemDesc, setItemDesc] = useState<string>("");
  const [errorDescripcion, setErrorDescripcion] = useState<string>("");

  const [precioCompra, setPrecioCompra] = useState<number | "">("");
  const [precioVenta, setPrecioVenta] = useState<number | "">("");
  const [catSelect, setCatSelect] = useState<number | "">("");
  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);

  useEffect(() => {
    async function fetchData() {
      const selectRolesOpts = await getCategorias();
      setCategoriasList(selectRolesOpts);
    }
    fetchData();
  }, []);

  const isFormValid =
    errorDescripcion === "" &&
    itemDesc.trim() !== "" &&
    precioCompra !== "" &&
    precioVenta !== "" &&
    catSelect !== "";

  async function handleCreate() {
    if (errorDescripcion) {
      toast.error(errorDescripcion);
      return;
    }

    const response = await crearArticulo({
      descripcion: itemDesc,
      valor_unitario: Number(precioCompra),
      precio: Number(precioVenta),
      categoria_id: catSelect as number,
    });

    if (response.status === 200) {
      toast.success(response.message);
      setItemDesc("");
      setPrecioCompra("");
      setPrecioVenta("");
      setCatSelect("");
      setErrorDescripcion("");
    } else {
      toast.error(response.message);
    }
  }

  return (
    <>
      <NavBar />
      <div className="viewContainer">
        <h2>Crear producto</h2>

        <div className="createFieldsContainer">
          {/* ✅ Input descripción con validación */}
          <SimpleInput
            label="Descripción"
            type="text"
            value={itemDesc}
            onValueChange={(val) => {
              const soloLetras = val.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "");
              setItemDesc(soloLetras);

              const trimmed = soloLetras.trim();

              if (trimmed.length === 0) {
                setErrorDescripcion("Este campo es obligatorio.");
              } else if (trimmed.length < 3) {
                setErrorDescripcion("Debe tener mínimo 3 caracteres.");
              } else if (trimmed.length > 20) {
                setErrorDescripcion("Debe tener máximo 20 caracteres.");
              } else {
                setErrorDescripcion("");
              }
            }}
            required
          />

          {errorDescripcion && (
            <p className="inputErrorMessage">{errorDescripcion}</p>
          )}

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
    </>
  );
}