import "./App.css";
import Navbar from "./Components/Header/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";

function App() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;
