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
  const [errorDescripcion, setErrorDescripcion] = useState<string>("");

  const [precioCompra, setPrecioCompra] = useState<string>("");
  const [precioVenta, setPrecioVenta] = useState<string>("");

  const [errorPrecioCompra, setErrorPrecioCompra] = useState<string>("");
  const [errorPrecioVenta, setErrorPrecioVenta] = useState<string>("");

  const [catSelect, setCatSelect] = useState<number | "">("");
  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);
  const [activo, setActivo] = useState<boolean>(true);

  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Validaciones de precio
  const validarPrecio = (value: string, setError: (t: string) => void) => {
    if (value.trim() === "") {
      setError("Este campo es obligatorio.");
      return;
    }

    if (!/^\d+$/.test(value)) {
      setError("Solo se permiten números positivos.");
      return;
    }

    if (value.length < 3) {
      setError("Debe tener mínimo 3 dígitos.");
      return;
    }

    if (value.length > 10) {
      setError("Debe tener máximo 10 dígitos.");
      return;
    }

    setError("");
  };

  useEffect(() => {
    async function load() {
      const result = await getArticuloById(Number(id));
      const selectCategorias = await getCategorias("", "");

      setCategoriasList(selectCategorias);

      if (result.status === 200) {
        const data = result.data;

        setItemDesc(data.descripcion);
        setPrecioCompra(String(data.valor_unitario));
        setPrecioVenta(String(data.precio));
        setActivo(data.activo);
        setCatSelect(data.categoria_id);
      }
    }
    load();
  }, []);

  // ✅ Validación general del formulario
  const isFormValid =
    errorDescripcion === "" &&
    errorPrecioCompra === "" &&
    errorPrecioVenta === "" &&
    itemDesc.trim() !== "" &&
    precioCompra !== "" &&
    precioVenta !== "" &&
    catSelect !== "";

  // ✅ Guardar cambios
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Por favor corrige los errores antes de continuar.");
      return;
    }

    const response = await updateArticulo(Number(id), {
      descripcion: itemDesc,
      valor_unitario: Number(precioCompra),
      precio: Number(precioVenta),
      categoria_id: Number(catSelect),
      activo,
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

      <div
        style={{
          padding: "20px",
          fontFamily: "sans-serif",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            marginLeft: "15px",
            marginTop: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          Editar artículo
        </h2>

        <form onSubmit={handleUpdate}>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          >

            {/* ✅ Nombre del producto */}
            <div style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
              <SimpleInput
                label="Nombre del producto"
                type="text"
                value={itemDesc}
                onValueChange={(val) => {
                  const soloLetras = val.replace(
                    /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g,
                    ""
                  );
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
              />

              {errorDescripcion && (
                <p style={{ color: "#d9534f", fontSize: "13px" }}>
                  {errorDescripcion}
                </p>
              )}
            </div>

            {/* ✅ Precio compra */}
            <div style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
              <SimpleInput
                label="Valor de compra"
                type="text"
                value={precioCompra}
                onValueChange={(val) => {
                  setPrecioCompra(val);
                  validarPrecio(val, setErrorPrecioCompra);
                }}
              />

              {errorPrecioCompra && (
                <p style={{ color: "#d9534f", fontSize: "13px" }}>
                  {errorPrecioCompra}
                </p>
              )}
            </div>

            {/* ✅ Precio venta */}
            <div style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
              <SimpleInput
                label="Valor de venta"
                type="text"
                value={precioVenta}
                onValueChange={(val) => {
                  setPrecioVenta(val);
                  validarPrecio(val, setErrorPrecioVenta);
                }}
              />

              {errorPrecioVenta && (
                <p style={{ color: "#d9534f", fontSize: "13px" }}>
                  {errorPrecioVenta}
                </p>
              )}
            </div>

            {/* Categoría + Estado */}
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ fontFamily: "sans-serif" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Categoría
                </label>
                <select
                  id="productCat"
                  style={{
                    width: "200px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    height: "38px",
                  }}
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
                confirmMessage="¿Seguro que deseas deshabilitar este producto?"
                onValueChange={setActivo}
              />
            </div>

          </div>

          {/* ✅ Botón Guardar */}
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid ? "#007bff" : "#cccccc",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: isFormValid ? "pointer" : "not-allowed",
              fontSize: "16px",
              marginTop: "20px",
            }}
          >
            Guardar
          </button>
        </form>
      </div>
    </>
  );
}