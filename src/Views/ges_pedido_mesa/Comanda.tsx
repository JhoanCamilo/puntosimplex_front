import { ReturnButton } from "../../components/buttons/UtilityButtons";
import { NavBar } from "../../components/layout/Navbar";
import "../Styles/ComandaView.css";

import { getCategorias } from "../../services/gesCategorias";
import { getArticulos } from "../../services/gesArticulos";
import { crearPedidoMesa } from "../../services/gesPedidos";

import { type categoria, type producto } from "../../services/utils/models";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ComandaView() {
  const { id: mesaId } = useParams();
  const navigate = useNavigate();

  const [catSelect, setCatSelect] = useState<string>("");
  const [productSelect, setProductSelect] = useState<number | "">("");

  const [categoriasList, setCategoriasList] = useState<categoria[]>([]);
  const [productosList, setProductosList] = useState<producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<producto[]>([]);

  const [items, setItems] = useState<
    {
      articulo_id: number;
      descripcion: string;
      cantidad: number;       // valor numérico para backend
      cantidadTexto: string;  // valor textual para el input
      nota: string;
      precio: number;
    }[]
  >([]);

  // Carga inicial
  useEffect(() => {
    async function fetchAll() {
      const categorias = await getCategorias("", "");
      const productos = await getArticulos("", "", "");
      setCategoriasList(categorias);
      setProductosList(productos);
    }
    fetchAll();
  }, []);

  // Filtrar por categoría
  useEffect(() => {
    if (!catSelect) {
      setProductosFiltrados([]);
      setProductSelect("");
      return;
    }
    const filtro = productosList.filter(
      (p) => String(p.categoria_id) === String(catSelect)
    );
    setProductosFiltrados(filtro);
  }, [catSelect, productosList]);

  // Añadir producto
  const handleAddProduct = () => {
    if (!productSelect) return;
    const prod = productosFiltrados.find(
      (p) => p.articulo_id === Number(productSelect)
    );
    if (!prod) return;

    const existe = items.find((i) => i.articulo_id === prod.articulo_id);
    if (existe) {
      toast.error("Este producto ya está agregado.");
      return;
    }

    setItems(prev => [
      ...prev,
      {
        articulo_id: prod.articulo_id,
        descripcion: prod.descripcion,
        cantidad: 1,
        cantidadTexto: "1",
        nota: "",
        precio: prod.precio ?? 0,
      },
    ]);
    setProductSelect("");
  };

  // Actualiza cantidad (texto + num)
  const actualizarCantidad = (id: number, texto: string) => {
    // permitir cadena vacía mientras escribe
    setItems(prev =>
      prev.map(item =>
        item.articulo_id === id
          ? {
              ...item,
              cantidadTexto: texto,
              cantidad: texto === "" ? 0 : Number(texto) || 0,
            }
          : item
      )
    );
  };

  // Al perder foco, validar cantidad mínima
  const validarCantidadOnBlur = (id: number) => {
    const it = items.find(i => i.articulo_id === id);
    if (!it) return;
    if (it.cantidad < 1) {
      toast.error("La cantidad debe ser mayor a 0");
      actualizarCantidad(id, "1");
    }
  };

  // Actualizar nota
  const actualizarNota = (id: number, nota: string) => {
    setItems(prev => prev.map(it => it.articulo_id === id ? { ...it, nota } : it));
  };

  // Eliminar
  const eliminarItem = (id: number) => {
    setItems(prev => prev.filter(i => i.articulo_id !== id));
  };

  // Registrar pedido (usa tu servicio)
  const handleRegistrarPedido = async () => {
    if (items.length === 0) {
      toast.error("Debes agregar productos antes de continuar.");
      return;
    }

    // validar cantidades > 0
    for (const it of items) {
      if (!it.cantidad || it.cantidad < 1) {
        toast.error("Asegúrate que todas las cantidades sean mayores a 0.");
        return;
      }
    }

    // preparar detalles
    const detalles = items.map(i => ({
      articulo_id: i.articulo_id,
      cantidad: i.cantidad,
      nota: i.nota,
      precio: i.precio,
    }));

    const response = await crearPedidoMesa({
      num_mesa: Number(mesaId),
      detalles,
    });

    if (response.status === 200) {
      toast.success("✅ Pedido registrado correctamente");
      setTimeout(() => navigate("/Mesero"), 800);
    } else {
      toast.error(response.message || "Error registrando pedido");
    }
  };

  return (
    <>
      <NavBar />
      <div className="comandaView">
        <div className="comandaHeader">
          <ReturnButton />
          <p className="comandaTitle">Mesa {mesaId ?? "?"}</p>
        </div>

        <div className="campo">
          <label>Categoría</label>
          <select
            value={catSelect}
            onChange={(e) => setCatSelect(e.target.value)}
            className="comandaSelect"
          >
            <option value="">Seleccione una categoría...</option>
            {categoriasList.map((c) => (
              <option key={c.categoria_id} value={c.categoria_id}>
                {c.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Productos</label>
          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={productSelect}
              onChange={(e) => setProductSelect(e.target.value as any)}
              className="comandaSelect"
            >
              <option value="">Seleccione un producto...</option>
              {productosFiltrados.map((p) => (
                <option key={p.articulo_id} value={p.articulo_id}>
                  {p.descripcion} - ${p.precio}
                </option>
              ))}
            </select>
            <button
              className="addButton"
              onClick={(e) => {
                e.preventDefault();
                handleAddProduct();
              }}
            >
              +
            </button>
          </div>
        </div>

        <div className="listaCards">
          {items.map((item) => (
            <div key={item.articulo_id} className="cardItem">

  {/* === ENCABEZADO: Producto | Cant. | Subtotal === */}
  <div className="cardRow cardHeaderRow" style={{ marginBottom: "8px" }}>
    <span className="cardColProducto">Producto</span>
    <span className="cardColCantidad">Cant.</span>
    <span className="cardColSubtotal">Subtotal</span>
  </div>

  {/* === FILA PRINCIPAL === */}
  <div className="cardRow" style={{ marginBottom: "10px" }}>
    {/* PRODUCTO */}
    <span className="cardColProducto">
      {item.descripcion}
    </span>

    {/* CANTIDAD (EDITABLE) */}
    <input
      type="number"
      className="inputCantidad cardColCantidad"
      value={item.cantidad === 0 ? "" : item.cantidad}
      onChange={(e) => {
        const val = e.target.value;

        if (val === "") {
          actualizarCantidad(item.articulo_id, 0);
          return;
        }

        const num = Number(val);
        if (!Number.isNaN(num)) actualizarCantidad(item.articulo_id, num);
      }}
      onBlur={() => {
        if (item.cantidad < 1) {
          toast.error("La cantidad debe ser mayor a 0");
          actualizarCantidad(item.articulo_id, 1);
        }
      }}
    />

    {/* SUBTOTAL */}
    <span className="cardColSubtotal">
      {(item.cantidad * item.precio).toLocaleString("es-CO")}
    </span>
  </div>

  {/* === OBSERVACIONES === */}
  <p className="cardTitulo">Observaciones</p>
  <textarea
    className="inputNota"
    placeholder="Observaciones del producto…"
    value={item.nota}
    onChange={(e) => actualizarNota(item.articulo_id, e.target.value)}
  />

  {/* === BOTÓN ELIMINAR === */}
  <button
    className="btnEliminarFull"
    onClick={() => eliminarItem(item.articulo_id)}
  >
    Eliminar
  </button>
</div>

          ))}
        </div>

        <button className="btnRegistrar" onClick={handleRegistrarPedido}>
          Registrar Pedido
        </button>
      </div>
    </>
  );
}
