import "./Styles/LoginView.css";
import { SimpleLoginInput, PasswordLoginInput } from "../components/Inputs/LoginInputs";
import { LoginButton } from "../components/buttons/LoginButton";
import logoImage from "../assets/puntoLogo.png";
import { useEffect, useState } from "react";
import { LoginFunction } from "../services/LoginFunc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

export default function LoginView() {
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [disaBtn, setDisaBtn] = useState<boolean>(true);
  const { login } = useAuth();

  useEffect(() => {
    setDisaBtn(!(user.trim() && pass.trim()));
  }, [user, pass]);

  async function handleLogin() {
    const result = await LoginFunction(user, pass);

    if (result.status === 200 && result.user) {
      console.log(result);
      
      toast.success(result.message);
      login(result.user);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="ViewContainer">
      <div className="formContainer">
        <img src={logoImage} alt="Logo_PuntoSimplex" />
        <SimpleLoginInput title="Usuario" value={user} onValueChange={setUser} />
        <PasswordLoginInput title="Contraseña" value={pass} onValueChange={setPass} />
        <LoginButton LoginFunction={handleLogin} disabledBtn={disaBtn} />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}
