import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { NavBar } from "../../components/layout/Navbar";
import { ReturnButton } from "../../components/buttons/UtilityButtons";

import SearchSelect from "../../components/selectors/select2";

import { getCategorias } from "../../services/gesCategorias";
import { getArticulos } from "../../services/gesArticulos";
import { getPedidoById, updatePedido } from "../../services/gesPedidos";

import "../Styles/ComandaView.css";

export default function ComandaEditView() {
  const { id: pedidoId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  const [categoriaId, setCategoriaId] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const [productoSeleccionado, setProductoSeleccionado] = useState<any>("");

  const [items, setItems] = useState<
    {
      articulo_id: number;
      descripcion: string;
      cantidad: number;
      nota: string;
      precio: number;
      cantidadTexto: string;
    }[]
  >([]);

  /* ================================================================
     ✅ CARGA INICIAL: categorías, productos y pedido
  ================================================================== */

  useEffect(() => {
    const cargarTodo = async () => {
      const cats = await getCategorias("", "");
      const prods = await getArticulos("", "", "");

      setCategorias(cats);
      setProductos(prods);

      // ===== Cargar pedido =====
      const pedidoRes = await getPedidoById(Number(pedidoId));

      if (pedidoRes.status !== 200) {
        toast.error("Pedido no encontrado");
        navigate("/Mesero");
        return;
      }

      const det = pedidoRes.data.pedido_det;

      // Mapear items ya existentes
      const mapped = det.map((d: any) => ({
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
  }, []);

  /* ================================================================
     ✅ FILTRAR PRODUCTOS POR CATEGORÍA
  ================================================================== */

  useEffect(() => {
    if (!categoriaId) {
      setProductosFiltrados([]);
      return;
    }
    const filtro = productos.filter(
      (x) => String(x.categoria_id) === String(categoriaId)
    );
    setProductosFiltrados(filtro);
  }, [categoriaId, productos]);

  /* ================================================================
     ✅ AGREGAR PRODUCTO NUEVO AL PEDIDO
  ================================================================== */

  const agregarProducto = () => {
    if (!productoSeleccionado) return;

    const prod = productosFiltrados.find(
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
     ✅ ACTUALIZAR CANTIDAD
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
     ✅ ACTUALIZAR NOTA
  ================================================================== */

  const actualizarNota = (id: number, nota: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.articulo_id === id ? { ...item, nota } : item
      )
    );
  };

  /* ================================================================
     ✅ ELIMINAR PRODUCTO
  ================================================================== */

  const eliminarItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.articulo_id !== id));
  };

  /* ================================================================
     ✅ GUARDAR CAMBIOS
  ================================================================== */

  const guardarCambios = async () => {
    if (items.length === 0) {
      toast.error("El pedido no puede quedar vacío.");
      return;
    }

    // validar cantidades
    for (const it of items) {
      if (it.cantidad < 1) {
        toast.error("Hay cantidades inválidas.");
        return;
      }
    }

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
          <p className="comandaTitle">Editar Pedido #{pedidoId}</p>
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
          onChange={(v) => setProductoSeleccionado(v as number)}
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
              {/* Encabezado */}
              <div className="cardRow cardHeaderRow" style={{ marginBottom: "8px" }}>
                <span className="cardColProducto">Producto</span>
                <span className="cardColCantidad">Cant.</span>
                <span className="cardColSubtotal">Subtotal</span>
              </div>

              {/* Fila principal */}
              <div className="cardRow" style={{ marginBottom: "10px" }}>
                <span className="cardColProducto">{item.descripcion}</span>

                <input
                  type="number"
                  className="inputCantidad cardColCantidad"
                  value={item.cantidadTexto}
                  onChange={(e) => actualizarCantidad(item.articulo_id, e.target.value)}
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
                onChange={(e) => actualizarNota(item.articulo_id, e.target.value)}
                placeholder="Observaciones del producto…"
              />

              <button
                className="btnEliminarFull"
                onClick={() => eliminarItem(item.articulo_id)}
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