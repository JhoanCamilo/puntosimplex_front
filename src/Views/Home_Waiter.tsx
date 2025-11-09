import { useState, useEffect } from "react";
import { NavBar } from "../components/layout/Navbar";
import { type mesa } from "../services/utils/models";
import { getMesas, ocuparMesa, liberarMesa } from "../services/meseroService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdTableRestaurant, MdOutlineTableRestaurant } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL!;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(url, key);

const styles: { [key: string]: React.CSSProperties } = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "20px",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  mesaBase: {
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    transition: "transform 0.2s, opacity 0.2s",
  },
  mesaDisponible: {
    filter: "none",
    opacity: 1,
    cursor: "pointer",
  },
  mesaOcupada: {
    filter: "grayscale(100%)",
    opacity: 0.7,
    cursor: "pointer",
  },
  mesaTexto: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#333",
    fontSize: "1.1rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "320px",
    textAlign: "center",
  },
  modalButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    margin: "6px",
  },
  btnPrimary: {
    backgroundColor: "#007bff",
    color: "white",
  },
  btnDanger: {
    backgroundColor: "#d9534f",
    color: "white",
  },
  btnSecondary: {
    backgroundColor: "#6c757d",
    color: "white",
  },
};

/* Modal con botón "Cancelar" en todos los modos */
function ModalMesa({ mesa, modo, onConfirm, onLiberar, onClose }: any) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>{mesa.numero}</h2>

        {modo === "no_ocupada" && (
          <>
            <p>¿Iniciar pedido en esta mesa?</p>
            <div>
              <button
                style={{ ...styles.modalButton, ...styles.btnPrimary }}
                onClick={onConfirm}
              >
                Iniciar pedido
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.btnSecondary }}
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        {modo === "ocupada_sin_pedido" && (
          <>
            <p>Seleccione una acción para esta mesa:</p>
            <div>
              <button
                style={{ ...styles.modalButton, ...styles.btnPrimary }}
                onClick={onConfirm}
              >
                Iniciar pedido
              </button>

              <button
                style={{ ...styles.modalButton, ...styles.btnDanger }}
                onClick={onLiberar}
              >
                Liberar mesa
              </button>

              <button
                style={{ ...styles.modalButton, ...styles.btnSecondary }}
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        {modo === "ocupada_con_pedido" && (
          <>
            <p>Esta mesa tiene un pedido activo.</p>
            <div>
              <button
                style={{ ...styles.modalButton, ...styles.btnPrimary }}
                onClick={onConfirm}
              >
                Editar pedido
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.btnSecondary }}
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function WaiterView() {
  const navigate = useNavigate();

  const [mesas, setMesas] = useState<mesa[]>([]);
  const [loading, setLoading] = useState(true);

  // mapa { numeroMesa: true }
  const [mesasConPedido, setMesasConPedido] = useState<Record<number, boolean>>(
    {}
  );

  const [mesaSeleccionada, setMesaSeleccionada] = useState<mesa | null>(null);
  const [modoMesa, setModoMesa] = useState<
    "no_ocupada" | "ocupada_sin_pedido" | "ocupada_con_pedido" | null
  >(null);

  /* Cargar mesas */
  const cargarMesas = async () => {
    try {
      setLoading(true);
      const data = await getMesas();
      setMesas(data);
    } catch {
      toast.error("Error cargando mesas");
    } finally {
      setLoading(false);
    }
  };

  /* Cargar pedidos por mesa -> normalizo a Number */
  const cargarPedidosMesas = async () => {
    const { data, error } = await supabase
      .from("pedido_enc")
      .select("num_mesa");

    if (error || !data) {
      console.error("Error cargando pedidos:", error);
      return;
    }

    const estado: Record<number, boolean> = {};
    data.forEach((p: any) => {
      const n = Number(p.num_mesa);
      if (!Number.isNaN(n)) estado[n] = true;
    });

    setMesasConPedido(estado);
  };

  useEffect(() => {
    // cargar ambas listas en paralelo
    cargarMesas();
    cargarPedidosMesas();
  }, []);

  /* Click en mesa: decido modo según estado y existencia de pedido */
  const handleMesaClick = (mesa: mesa) => {
    const numeroMesa = Number(mesa.numero);
    const tienePedido = mesasConPedido[numeroMesa] === true;

    if (!mesa.estado) {
      setModoMesa("no_ocupada");
    } else {
      setModoMesa(tienePedido ? "ocupada_con_pedido" : "ocupada_sin_pedido");
    }

    setMesaSeleccionada(mesa);
  };

  /* Iniciar o editar: si no está ocupada la ocupamos; luego navegamos */
  const iniciarOEditar = async () => {
    if (!mesaSeleccionada) return;

    // si no está ocupada, la ocupamos primero
    if (!mesaSeleccionada.estado) {
      try {
        await ocuparMesa(mesaSeleccionada);
        // refrescar mesas para reflejar estado
        await cargarMesas();
      } catch (err) {
        toast.error("No se pudo ocupar la mesa");
        return;
      }
    }

    // navegar a la comanda (crear o editar según exista pedido en backend)
    navigate(`/Comanda/${mesaSeleccionada.id}`);
  };

  /* Liberar mesa (solo si no hay pedido) */
  const liberar = async () => {
    if (!mesaSeleccionada) return;
    try {
      await liberarMesa(mesaSeleccionada.id);
      toast.success(`Mesa ${mesaSeleccionada.numero} liberada`);
      // refrescar listas
      await cargarMesas();
      await cargarPedidosMesas();
    } catch (err) {
      toast.error("No se pudo liberar la mesa");
    } finally {
      setMesaSeleccionada(null);
      setModoMesa(null);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Cargando mesas...
        </p>
      </>
    );
  }

  return (
    <>
      <NavBar />

      <div style={styles.gridContainer}>
        {mesas.map((mesa) => {
          const estiloMesa = {
            ...styles.mesaBase,
            ...(mesa.estado ? styles.mesaOcupada : styles.mesaDisponible),
          };

          return (
            <div
              key={mesa.id}
              style={estiloMesa}
              onClick={() => handleMesaClick(mesa)}
              title={
                !mesa.estado
                  ? `Iniciar pedido - ${mesa.numero}`
                  : mesasConPedido[Number(mesa.numero)]
                  ? `Editar pedido - ${mesa.numero}`
                  : `Mesa ocupada - ${mesa.numero}`
              }
            >
              {mesa.estado ? (
                <MdTableRestaurant fontSize={80} />
              ) : (
                <MdOutlineTableRestaurant fontSize={80} />
              )}
              <span style={styles.mesaTexto}>{mesa.numero}</span>
            </div>
          );
        })}
      </div>

      {mesaSeleccionada && modoMesa && (
        <ModalMesa
          mesa={mesaSeleccionada}
          modo={modoMesa}
          onConfirm={() => {
            // cerrar modal y ejecutar
            setMesaSeleccionada(null);
            setModoMesa(null);
            iniciarOEditar();
          }}
          onLiberar={() => {
            // cerrar modal y liberar
            setMesaSeleccionada(null);
            setModoMesa(null);
            liberar();
          }}
          onClose={() => {
            setMesaSeleccionada(null);
            setModoMesa(null);
          }}
        />
      )}
    </>
  );
}
