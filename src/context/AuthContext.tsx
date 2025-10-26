import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// 🔹 Tipo de usuario
export interface User {
  username: string;
  role: "Admin" | "Mesero" | "Cajero";
}

// 🔹 Interfaz para el contexto
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// 🔹 Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔹 Hook personalizado para usar el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

// 🔹 Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate(`/${userData.role}`);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const value: AuthContextType = { user, login, logout };

  return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};
