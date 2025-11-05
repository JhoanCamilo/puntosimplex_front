import { NavBar } from "../../../components/layout/Navbar"; 
import { useParams } from "react-router-dom";
import "../inventoryStyles.css"; 

export default function CategoriaEditar() {
  // Obtenemos el ID de la URL, aunque no lo usemos aún
  const { id } = useParams();

  return (
    <>
      <NavBar />
      
      <div >
        <h2>Editar Categoría (ID: {id})</h2>

        <div
          style={{
            marginTop: "30px",
            padding: "40px",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            border: "1px dashed #ccc",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ margin: "0", fontSize: "1.5rem", color: "#555" }}>
            Para el próximo sprint
          </h3>
          <p style={{ fontSize: "1rem", color: "#777" }}>
            Esta funcionalidad de edición estará disponible en la próxima
            versión.
          </p>
        </div>
      </div>
    </>
  );
}
