import { NavBar } from "../../../components/layout/Navbar";
import { SimpleInput } from "../../../components/Inputs/formInputs";
import { useEffect, useState } from "react";
import { type categoria } from "../../../services/utils/models";
import { getCategorias } from "../../../services/gesCategorias";
import { crearArticulo } from "../../../services/gesArticulos";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ArticulosCreate() {
  const navigate = useNavigate();

  const [itemDesc, setItemDesc] = useState<string>("");
  const [errorDescripcion, setErrorDescripcion] = useState<string>("");

  const [precioCompra, setPrecioCompra] = useState<string>("");
  const [precioVenta, setPrecioVenta] = useState<string>("");

  const [errorPrecioCompra, setErrorPrecioCompra] = useState<string>("");
  const [errorPrecioVenta, setErrorPrecioVenta] = useState<string>("");

  const [catSelect, setCatSelect] = useState<number | "">("");
  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);

  useEffect(() => {
    async function fetchData() {
      const selectRolesOpts = await getCategorias("", "");
      setCategoriasList(selectRolesOpts);
    }
    fetchData();
  }, []);

  // ✅ VALIDACIÓN GENERAL DEL FORMULARIO
  const isFormValid =
    errorDescripcion === "" &&
    errorPrecioCompra === "" &&
    errorPrecioVenta === "" &&
    itemDesc.trim() !== "" &&
    precioCompra !== "" &&
    precioVenta !== "" &&
    catSelect !== "";

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (errorDescripcion || errorPrecioCompra || errorPrecioVenta) {
      toast.error("Por favor corrige los errores antes de continuar.");
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

      // ✅ Redirección tras crear
      setTimeout(() => navigate("/Articulos"), 800);

      // Reset
      setItemDesc("");
      setPrecioCompra("");
      setPrecioVenta("");
      setCatSelect("");
      setErrorDescripcion("");
      setErrorPrecioCompra("");
      setErrorPrecioVenta("");
    } else {
      toast.error(response.message);
    }
  }

  // ✅ VALIDACIONES PARA PRECIOS
  const validarPrecio = (value: string, setError: (t: string) => void) => {
    if (value.trim() === "") {
      setError("Este campo es obligatorio.");
      return;
    }

    if (!/^\d+$/.test(value)) {
      setError("Solo se permiten números.");
      return;
    }

    if (value.length < 3) {
      setError("Debe tener mínimo 3 dígitos.");
      return;
    }

    if (value.length > 10) {
      setError("Máximo 10 dígitos.");
      return;
    }

    setError("");
  };

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
          Crear producto
        </h2>

        <form onSubmit={handleCreate}>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          >
            {/* ✅ Nombre del producto */}
            <div
              style={{
                marginBottom: "15px",
                display: "flex",
                flexDirection: "column",
              }}
            >
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
            <div
              style={{
                marginBottom: "15px",
                display: "flex",
                flexDirection: "column",
              }}
            >
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
            <div
              style={{
                marginBottom: "15px",
                display: "flex",
                flexDirection: "column",
              }}
            >
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

            {/* ✅ Categoría */}
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
          </div>

          {/* ✅ Botón Crear */}
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
            Crear
          </button>
        </form>
      </div>
    </>
  );
}
