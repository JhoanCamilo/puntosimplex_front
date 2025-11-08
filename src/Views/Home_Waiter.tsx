import { useState, useEffect } from "react";
import { NavBar } from "../components/layout/Navbar"; 
import { type mesa } from "../services/utils/models";
import { getMesas, ocuparMesa, liberarMesa } from "../services/meseroService";
import { toast } from "react-toastify"; 
import tableIcon from '../assets/mesa_icono.png'; 

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
    transition: "transform 0.2s, box-shadow 0.2s, filter 0.2s, opacity 0.2s",
  },
  mesaDisponible: {
    filter: "none", 
    opacity: 1,
    cursor: "pointer",
  },
  mesaOcupada: {
    filter: "grayscale(100%)", 
    opacity: 0.6, 
    cursor: "pointer", 
  },
  mesaImagen: {
    width: "80px", 
    height: "auto",
    objectFit: "contain", 
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
    fontFamily: "sans-serif",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  },
  modalButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    margin: "0 5px",
  },
  confirmButton: {
    backgroundColor: "#007bff", // Azul
    color: "white",
  },
  cancelButton: {
    backgroundColor: "#6c757d", // Gris
    color: "white",
  },
};

interface ModalOcuparProps {
  mesa: mesa;
  onClose: () => void;
  onConfirm: () => void;
}

function ModalOcupar({ mesa, onClose, onConfirm }: ModalOcuparProps) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>Ocupar {mesa.numero}</h2>
        <p>¿Desea seleccionar esta mesa como ocupada?</p>
        <div style={{ marginTop: "20px" }}>
          <button
            style={{ ...styles.modalButton, ...styles.cancelButton }}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            style={{ ...styles.modalButton, ...styles.confirmButton }}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModalLiberarProps {
  mesa: mesa;
  onClose: () => void;
  onConfirm: () => void;
}

function ModalLiberar({ mesa, onClose, onConfirm }: ModalLiberarProps) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>Liberar {mesa.numero}</h2>
        <p>¿Está seguro que desea liberar esta mesa?</p>
        <div style={{ marginTop: "20px" }}>
          <button
            style={{ ...styles.modalButton, ...styles.cancelButton }}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            style={{ ...styles.modalButton, ...styles.confirmButton }}
            onClick={onConfirm}
          >
            Confirmar y Liberar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WaiterView() {
  const [mesas, setMesas] =useState<mesa[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [mesaParaOcupar, setMesaParaOcupar] = useState<mesa | null>(null);
  const [mesaParaLiberar, setMesaParaLiberar] = useState<mesa | null>(null);

  const cargarMesas = async () => {
    try {
      setLoading(true);
      const data = await getMesas();
      setMesas(data);
    } catch (error) {
      toast.error("Error al cargar las mesas.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    cargarMesas();
  }, []);

  const handleMesaClick = (mesa: mesa) => {
    if (mesa.estado === false) { 
      setMesaParaOcupar(mesa);
    } else { 
      setMesaParaLiberar(mesa);
    }
  };

  const handleConfirmarOcupar = async () => {
    if (!mesaParaOcupar) return;
    try {
      await ocuparMesa(mesaParaOcupar); 
      setMesas((prevMesas) =>
        prevMesas.map((m) =>
          m.id === mesaParaOcupar.id ? { ...m, estado: true } : m
        )
      );
      toast.success(`¡${mesaParaOcupar.numero} asignada!`);
      setMesaParaOcupar(null); 
    } catch (error) {
      toast.error("No se pudo asignar la mesa.");
      console.error(error);
    }
  };

  const handleConfirmarLiberar = async () => {
    if (!mesaParaLiberar) return;
    try {
      await liberarMesa(mesaParaLiberar.id);
      setMesas((prevMesas) =>
        prevMesas.map((m) =>
          m.id === mesaParaLiberar.id ? { ...m, estado: false } : m
        )
      );
      toast.success(`¡${mesaParaLiberar.numero} ha sido liberada!`);
      setMesaParaLiberar(null); 
    } catch (error) {
      toast.error("No se pudo liberar la mesa.");
      console.error(error);
    }
  };

  if (loading) {
     return (
      <>
        <NavBar />
        <p style={{textAlign: 'center', marginTop: '20px', fontFamily: 'sans-serif'}}>Cargando mesas...</p>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div style={styles.gridContainer}>
        {mesas.map((mesa) => {
          const esDisponible = mesa.estado === false;
          const estiloMesa = {
            ...styles.mesaBase,
            ...(esDisponible ? styles.mesaDisponible : styles.mesaOcupada),
          };

          return (
            <div
              key={mesa.id}
              style={estiloMesa}
              onClick={() => handleMesaClick(mesa)}
              title={esDisponible ? `Asignar ${mesa.numero}` : `Gestionar ${mesa.numero} (Ocupada)`}
            >
              <img src={tableIcon} alt={`Icono de ${mesa.numero}`} style={styles.mesaImagen} />
              <span style={styles.mesaTexto}>
                {mesa.numero}
              </span>
            </div>
          );
        })}
      </div>

      {mesaParaOcupar && (
        <ModalOcupar
          mesa={mesaParaOcupar}
          onClose={() => setMesaParaOcupar(null)}
          onConfirm={handleConfirmarOcupar}
        />
      )}
      
      {mesaParaLiberar && (
        <ModalLiberar
          mesa={mesaParaLiberar}
          onClose={() => setMesaParaLiberar(null)}
          onConfirm={handleConfirmarLiberar}
        />
      )}
    </>
  );
}