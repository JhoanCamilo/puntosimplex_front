// App.tsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginView from "./Views/Login";
import AdminView from "./Views/Home_Admin";
import WaiterView from "./Views/Home_Waiter";
import CashierView from "./Views/Home_Cashier";
import ProtectedRoute from "./services/ProtectedRoute";

export default function App() {
  return (
    // ✅ AuthProvider envuelve a las rutas, pero no dentro de <Routes>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route
          path="/Admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Mesero"
          element={
            <ProtectedRoute role="Mesero">
              <WaiterView />
            </ProtectedRoute>
          }
        />
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
