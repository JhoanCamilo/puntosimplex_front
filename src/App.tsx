import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginView from "./Views/Login";
import AdminView from "./Views/Home_Admin";
import WaiterView from "./Views/Home_Waiter";
import CashierView from "./Views/Home_Cashier";
import ProtectedRoute from "./services/ProtectedRoute";
import UsuariosIndex from "./Views/ges_usuarios/UsuariosIndex";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        //? Rutas Admin
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

        //? Rutas Mesero
        <Route
          path="/Mesero"
          element={
            <ProtectedRoute role="Mesero">
              <WaiterView />
            </ProtectedRoute>
          }
        />

        //? Rutas Cajero
        <Route
          path="/Cajero"
          element={
            <ProtectedRoute role="Cajero">
              <CashierView />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<LoginView />} />
      </Routes>
    </AuthProvider>
  );
}
