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
      const selectRolesOpts = await getCategorias("", ""); // Traer todas
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

  const isFormValid =
    itemDesc.trim() !== "" &&
    precioCompra !== "" &&
    precioVenta !== "" &&
    catSelect !== "";

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault(); 

    const response = await updateArticulo(Number(id), {
      descripcion: itemDesc,
      valor_unitario: Number(precioCompra),
      precio: Number(precioVenta),
      categoria_id: Number(catSelect),
      activo: activo,
    });

    if (response.status === 200) {
      toast.success(response.message);
      setTimeout(() => navigate("/Articulos"), 800);
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
          Editar artículo
        </h2>

        {/* Usamos <form> para manejar el evento onSubmit */}
        <form onSubmit={handleUpdate}>
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

            {/* Contenedor para Categoría y Estado  */}
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
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

              {/* Checkbox de Estado */}
              <ActivoCheckbox
                label="Estado"
                value={activo}
                onValueChange={setActivo}
              />
            </div>
            
          </div>

          {/* Botón de Guardar  */}
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
            Guardar
          </button>
        </form>
      </div>
    </>
  );
}