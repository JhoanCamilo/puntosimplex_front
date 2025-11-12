import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { NavBar } from "../../components/layout/Navbar";
import { ReturnButton } from "../../components/buttons/UtilityButtons";

import SearchSelect from "../../components/selectors/select2";

import { getCategorias } from "../../services/gesCategorias";
import { getArticulos } from "../../services/gesArticulos";
import {
  getPedidoById,
  updatePedido,
  eliminarDetallePedido,
  eliminarPedidoCompleto,
} from "../../services/gesPedidos";

import "../Styles/ComandaView.css";

export default function ComandaEditView() {
  const { id: pedidoId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [numMesa, setNumMesa] = useState<number | null>(null);

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  const [categoriaId, setCategoriaId] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const [productoSeleccionado, setProductoSeleccionado] = useState<any>("");

  const [items, setItems] = useState<
    {
      pedido_det_id?: number;
      articulo_id: number;
      descripcion: string;
      cantidad: number;
      nota: string;
      precio: number;
      cantidadTexto: string;
    }[]
  >([]);

  /* ================================================================
     ✅ CARGA INICIAL
   ================================================================== */

  useEffect(() => {
    // toast.info("⚡ Renderizando Editar Comanda"); // Opcional: puede ser molesto
    const cargarTodo = async () => {
      const cats: any = await getCategorias("", "");
      const prods: any = await getArticulos("", "", "");

      setCategorias(cats as any);
      setProductos(prods as any);

      const pedidoRes = await getPedidoById(Number(pedidoId));

      if (pedidoRes.status !== 200) {
        toast.error("Pedido no encontrado");
        navigate("/Mesero");
        return;
      }

      setNumMesa(pedidoRes.data.num_mesa);
      const det = pedidoRes.data.pedido_det;

      const mapped = det.map((d: any) => ({
        pedido_det_id: d.pedido_det_id,
        articulo_id: d.articulo_id,
        descripcion: d.articulo.descripcion,
        cantidad: d.cantidad,
        cantidadTexto: String(d.cantidad),
        nota: d.nota ?? "",
        precio: d.articulo.precio,
      }));

      setItems(mapped);
      setLoading(false);
    };

    cargarTodo();
  }, [pedidoId, navigate]);

  /* ==================================================================
     ✅ FILTRADO (Sin cambios)
   ===================================================================== */

  useEffect(() => {
    if (!categoriaId) {
      setProductosFiltrados([]);
      return;
    }
    const filtro = productos.filter(
      (x: any) => String(x.categoria_id) === String(categoriaId)
    );
    setProductosFiltrados(filtro as any);
  }, [categoriaId, productos]);

  /* ================================================================
     ✅ AGREGAR PRODUCTO (Sin cambios)
   ================================================================== */

  const agregarProducto = () => {
    if (!productoSeleccionado) return;

    const prod: any = productosFiltrados.find(
      (p: any) => p.articulo_id === Number(productoSeleccionado)
    );
    if (!prod) return;

    const yaExiste = items.find((i) => i.articulo_id === prod.articulo_id);
    if (yaExiste) {
      toast.error("Este producto ya está incluido en el pedido.");
      return;
    }

    setItems([
      ...items,
      {
        articulo_id: prod.articulo_id,
        descripcion: prod.descripcion,
        cantidad: 1,
        cantidadTexto: "1",
        nota: "",
        precio: prod.precio,
      },
    ]);

    setProductoSeleccionado("");
  };

  /* ================================================================
     ✅ ACTUALIZAR CANTIDAD (Sin cambios)
   ================================================================== */

  const actualizarCantidad = (id: number, texto: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.articulo_id === id
          ? {
              ...item,
              cantidadTexto: texto,
              cantidad: texto === "" ? 0 : Number(texto),
            }
          : item
      )
    );
  };

  const validarCantidadBlur = (id: number) => {
    const it = items.find((i) => i.articulo_id === id);
    if (!it) return;

    if (it.cantidad < 1) {
      toast.error("La cantidad debe ser mayor a 0");
      actualizarCantidad(id, "1");
    }
  };

  /* ================================================================
     ✅ ACTUALIZAR NOTA (Sin cambios)
   ================================================================== */

  const actualizarNota = (id: number, nota: string) => {
    setItems((prev) =>
      prev.map((item) => (item.articulo_id === id ? { ...item, nota } : item))
    );
  };

  /* ================================================================
     ✅ ELIMINAR PRODUCTO (¡CON ALERTA DE CONFIRMACIÓN!)
   ================================================================== */

  const eliminarItem = async (item: any) => {
    
   
    const confirmacion = window.confirm(
      `¿Está seguro que desea eliminar "${item.descripcion}" del pedido?`
    );

    if (!confirmacion) {
      return;


    console.log("🟦 Eliminando item:", item);

    if (!item) {
      console.error("❌ Error: item es undefined");
      toast.error("Error interno");
      return;
    }

    
    // --- Lógica HU_PedidosMesa_004 ---
    // 4. Al eliminar todos los items de un pedido, el pedido debe eliminarse...
    if (items.length === 1 && numMesa) {
      toast.warn("Eliminando último item. Liberando mesa...");
      try {
        await eliminarPedidoCompleto(Number(pedidoId), numMesa);
        toast.success("Pedido eliminado y mesa liberada.");
        navigate("/Mesero"); // Volver al mapa de mesas
      } catch (e: any) {
        toast.error(e.message || "No se pudo eliminar el pedido completo.");
      }
      return; // Detenemos la ejecución
    }
    // --- FIN Lógica ---

    // ✅ Caso: solo está en UI (no tiene ID de la BD)
    if (!item.pedido_det_id) {
      toast.info("Producto removido");
      setItems((prev) =>
        prev.filter((i) => i.articulo_id !== item.articulo_id)
      );
      return;
    }

    // ✅ Caso: El item está en la BD
    try {
      const { error } = await eliminarDetallePedido(item.pedido_det_id);

      if (error) {
        console.error("Supabase error:", error);
        toast.error("No se pudo eliminar el producto");
        return;
      }

      toast.success("Producto eliminado");
      // alert("Producto eliminado") // (Ya quitamos esto)

      setItems((prev) =>
        prev.filter((i) => i.articulo_id !== item.articulo_id)
      );
    } catch (err) {
      console.error("Error inesperado:", err);
      toast.error("Error inesperado al eliminar");
    }
  };

  /* ================================================================
     ✅ GUARDAR CAMBIOS (Lógica HU_PedidosMesa_004)
   ================================================================== */

  const guardarCambios = async () => {
    
    // --- Lógica HU_PedidosMesa_004 ---
    // ¿El usuario borró todos los items y le dio "Guardar"?
    if (items.length === 0 && numMesa) {
      toast.warn("El pedido está vacío. Liberando mesa...");
      try {
        await eliminarPedidoCompleto(Number(pedidoId), numMesa);
        toast.success("Pedido eliminado y mesa liberada.");
        navigate("/Mesero"); // Volver al mapa de mesas
      } catch (e: any) {
        toast.error(e.message || "No se pudo eliminar el pedido completo.");
      }
      return; // Detenemos la ejecución
    }
    // --- FIN Lógica ---

    // Lógica original de guardar cambios
    const detalles = items.map((i) => ({
      articulo_id: i.articulo_id,
      cantidad: i.cantidad,
      nota: i.nota,
      precio: i.precio,
    }));

    const resp = await updatePedido(Number(pedidoId), detalles);

    if (resp.status === 200) {
      toast.success("✅ Pedido actualizado");
      navigate("/Mesero");
    } else {
      toast.error(resp.message);
    }
  };

  /* ================================================================
     ✅ RENDER
   ================================================================== */

  if (loading) {
    return (
      <>
        <NavBar />
        <p style={{ textAlign: "center", marginTop: 20 }}>Cargando pedido…</p>
      </>
    );
  }

  return (
    <>
      <NavBar />

      <div className="comandaView">
        <div className="comandaHeader">
          <ReturnButton />
          <p className="comandaTitle">Editar Pedido</p>
        </div>

        {/* Selección de categoría */}
        <div className="campo">
          <label>Categoría</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="comandaSelect"
          >
            <option value="">Seleccione una categoría…</option>
            {categorias.map((c: any) => (
              <option key={c.categoria_id} value={c.categoria_id}>
                {c.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Buscador de producto */}
        <SearchSelect
          label="Producto"
          value={productoSeleccionado}
          onChange={(v: any) => setProductoSeleccionado(v as number)}
          options={productosFiltrados.map((p: any) => ({
            value: p.articulo_id,
            label: `${p.descripcion} - $${p.precio}`,
          }))}
          placeholder="Buscar producto…"
        />

        <button className="addButton" onClick={agregarProducto}>
          +
        </button>

        {/* Lista de productos */}
        <div className="listaCards">
          {items.map((item) => (
            <div key={item.articulo_id} className="cardItem">
              <div
                className="cardRow cardHeaderRow"
                style={{ marginBottom: "8px" }}
              >
                <span className="cardColProducto">Producto</span>
                <span className="cardColCantidad">Cant.</span>
                <span className="cardColSubtotal">Subtotal</span>
              </div>

              <div className="cardRow" style={{ marginBottom: "10px" }}>
                <span className="cardColProducto">{item.descripcion}</span>

                <input
                  type="number"
                  className="inputCantidad cardColCantidad"
                  value={item.cantidadTexto}
                  onChange={(e) =>
                    actualizarCantidad(item.articulo_id, e.target.value)
                  }
                  onBlur={() => validarCantidadBlur(item.articulo_id)}
                />

                <span className="cardColSubtotal">
                  {(item.cantidad * item.precio).toLocaleString("es-CO")}
                </span>
              </div>

              <p className="cardTitulo">Observaciones</p>
              <textarea
                className="inputNota"
                value={item.nota}
                onChange={(e) =>
                  actualizarNota(item.articulo_id, e.target.value)
                }
                placeholder="Observaciones del producto…"
              />

              <button
                className="btnEliminarFull"
                onClick={() => eliminarItem(item)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <button className="btnRegistrar" onClick={guardarCambios}>
          Guardar Cambios
        </button>
      </div>
    </>
  );
}