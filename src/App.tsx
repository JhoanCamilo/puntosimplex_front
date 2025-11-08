import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginView from "./Views/Login";
import AdminView from "./Views/Home_Admin";
import WaiterView from "./Views/Home_Waiter";
import CashierView from "./Views/Home_Cashier";
import ProtectedRoute from "./services/ProtectedRoute";

import UsuariosIndex from "./Views/ges_usuarios/UsuariosIndex";
import CreateUsers from "./Views/ges_usuarios/UsuariosCreate";
import EditUsers from "./Views/ges_usuarios/UsuariosEdit";

import InventarioHome from "./Views/ges_Inventario/inventarioHome";
import ArticulosIndex from "./Views/ges_Inventario/ges_articulos/articulosIndex";
import ArticulosCreate from "./Views/ges_Inventario/ges_articulos/createArtículos";
import ArticulosEdit from "./Views/ges_Inventario/ges_articulos/editArtículos";

import ControlCategoria from "./Views/ges_Inventario/ges_categoriasx/controlcategoria";
import CategoriaEditar from "./Views/ges_Inventario/ges_categoriasx/CategoriaEditar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>

      {/* ✅ ToastContainer siempre suelto */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="colored"
        closeOnClick
        pauseOnHover
      />

      {/* ✅ NO envuelvas Routes en un div */}
      <Routes>
        {/* --- Rutas Admin --- */}
        <Route
          path="/Admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/GestionUsuarios"
          element={
            <ProtectedRoute role="Admin">
              <UsuariosIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CreateOrEditUsuarios"
          element={
            <ProtectedRoute role="Admin">
              <CreateUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditUsuarios/:id"
          element={
            <ProtectedRoute role="Admin">
              <EditUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Inventario"
          element={
            <ProtectedRoute role="Admin">
              <InventarioHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Articulos"
          element={
            <ProtectedRoute role="Admin">
              <ArticulosIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ArticulosCrear"
          element={
            <ProtectedRoute role="Admin">
              <ArticulosCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ArticuloEditar/:id"
          element={
            <ProtectedRoute role="Admin">
              <ArticulosEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Categorias"
          element={
            <ProtectedRoute role="Admin">
              <ControlCategoria />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CategoriaEditar/:id"
          element={
            <ProtectedRoute role="Admin">
              <CategoriaEditar />
            </ProtectedRoute>
          }
        />

        {/* Rutas Mesero */}
        <Route
          path="/Mesero"
          element={
            <ProtectedRoute role="Mesero">
              <WaiterView />
            </ProtectedRoute>
          }
        />

        {/* Rutas Cajero */}
        <Route
          path="/Cajero"
          element={
            <ProtectedRoute role="Cajero">
              <CashierView />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<LoginView />} />
      </Routes>
    </AuthProvider>
  );
}

