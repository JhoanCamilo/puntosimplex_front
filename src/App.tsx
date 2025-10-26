import { Routes, Route } from "react-router-dom"
//? Routes
import LoginView from "./Views/Login"
import AdminView from "./Views/Home_Admin"
import WaiterView from "./Views/Home_Waiter"

function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginView/>}/>
      <Route path="/Admin" element={<AdminView/>}/>
      <Route path="/Mesero" element={<WaiterView/>}/>
    </Routes>
    </>
  )
}

export default App
