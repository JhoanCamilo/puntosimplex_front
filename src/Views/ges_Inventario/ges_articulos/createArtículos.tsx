import { NavBar } from "../../../components/layout/Navbar";
import { SimpleInput } from "../../../components/Inputs/formInputs";
import { useEffect, useState } from "react";
import { type categoria } from "../../../services/utils/models";
import { getCategorias } from "../../../services/gesCategorias";
import { crearArticulo } from "../../../services/gesArticulos";
import { toast } from "react-toastify";

export default function ArticulosCreate() {
  const [itemDesc, setItemDesc] = useState<string>("");
  const [precioCompra, setPrecioCompra] = useState<number | "">("");
  const [precioVenta, setPrecioVenta] = useState<number | "">("");
  const [catSelect, setCatSelect] = useState<number | "">("");
  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);

  useEffect(() => {
    async function fetchData() {
      const selectRolesOpts = await getCategorias("", ""); // Traer todas
      setCategoriasList(selectRolesOpts);
    }
    fetchData();
  }, []);

  const isFormValid =
    itemDesc.trim() !== "" &&
    precioCompra !== "" &&
    precioVenta !== "" &&
    catSelect !== "";

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); // Evita que la página se recargue

    const response = await crearArticulo({
      descripcion: itemDesc,
      valor_unitario: Number(precioCompra),
      precio: Number(precioVenta),
      categoria_id: catSelect as number,
    });

    if (response.status === 200) {
      toast.success(response.message);
      // Reset
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
      {/* Contenedor principal  */}
      <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
        
        <h2 style={{ marginLeft: "15px", marginTop: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          Crear artículo
        </h2>

        {/* Usamos <form> para manejar el evento onSubmit */}
        <form onSubmit={handleCreate}>
          {/* Tarjeta gris para los campos  */}
          <div style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #eee"
          }}>
            
            {/* Campos del formulario con espaciado */}
            <div style={{ marginBottom: "15px" }}>
              <SimpleInput
                label="Descripción"
                type="text"
                value={itemDesc}
                onValueChange={setItemDesc}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <SimpleInput
                label="Valor de compra"
                type="number"
                value={precioCompra}
                onValueChange={(val) =>
                  setPrecioCompra(val === "" ? "" : Number(val))
                }
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <SimpleInput
                label="Valor de venta"
                type="number"
                value={precioVenta}
                onValueChange={(val) =>
                  setPrecioVenta(val === "" ? "" : Number(val))
                }
              />
            </div>

            {/* Select de Categoría */}
            <div style={{ fontFamily: "sans-serif" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Categoría</label>
              <select
                id="productCat"
                style={{ width: "200px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", height: "38px" }}
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

          {/* Botón de Crear  */}
          <button
            type="submit" // Cambiado de onClick a type="submit"
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid ? "#007bff" : "#cccccc", // Azul (o gris si está deshabilitado)
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: isFormValid ? "pointer" : "not-allowed",
              fontSize: "16px",
              marginTop: "20px"
            }}
          >
            Crear
          </button>
        </form>
      </div>
    </>
  );
}
