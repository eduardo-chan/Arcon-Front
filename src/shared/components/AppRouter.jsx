import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthContext } from "../../modules/auth/authContext";
import Welcome from "../../modules/admin/Welcome";
import Archivos from "../../modules/admin/archivos/Archivos";
import Contraseñas from "../../modules/admin/contraseñas/Contraseñas";
import Empleados from "../../modules/admin/empleados/Empleados";
import AdminNavbar from "../../shared/components/AdminNavbar";
import LiderNav from "../../modules/Liderdearea/NavLider";
import BienvenidaL from "../../modules/Liderdearea/bienvenida";
import EmpleadosL from "../../modules/Liderdearea/Empleados/empleados";
import ArchivosL from "../../modules/Liderdearea/Archivos/archivos";
import NavbarE from "../../modules/Empleado/NavbarE";
import BienvenidaE from "../../modules/Empleado/bienvenida";
import ArchivosE from "../../modules/Empleado/Archivos/archivos";
import ContraseñasL from "../../modules/Liderdearea/Contraseñas/contraseñas";
import LoginScreen from "../../modules/auth/LoginScreen";
import PasswordForgot from "../../modules/auth/PasswordForgot";
import RecoveryPassword from "../../modules/auth/RecoveryPassword";
import InactiveUser from "../../modules/auth/InactiveUser"


const AppRouter = () => {
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(true);
  const isWelcomePage = window.location.pathname === "/";

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginScreen />} />
        <Route path="/password" element={<PasswordForgot />} />
        <Route path="/recovery" element={<RecoveryPassword />} />
        <Route
          path="/*"
          element={
            user.isLogged ? (
              <>
                {user.usuario.status ? (
                  <>
                    {user.usuario.role.name === "admin" ? (
                      <>
                        <Container
                          fluid={isWelcomePage}
                          style={{
                            padding: isWelcomePage ? 0 : "0px",
                            background: isWelcomePage ? "blue" : "none",
                            maxWidth: "100%",
                          }}
                        >
                          <AdminNavbar
                            isWelcomePage={window.location.pathname === "/"}
                          />
                          <Routes>
                            <Route index element={<Welcome />} />
                            <Route path="/archivos" element={<Archivos />} />
                            <Route
                              path="/contraseñas"
                              element={<Contraseñas />}
                            />
                            <Route path="/empleados" element={<Empleados />} />
                          </Routes>
                        </Container>
                      </>
                    ) : user.usuario.role.name === "lider" ? (
                      <>
                        <Container
                          fluid={isWelcomePage}
                          style={{
                            padding: isWelcomePage ? 0 : "0px",
                            maxWidth: "100%",
                          }}
                        >
                          <LiderNav
                            isWelcomePage={window.location.pathname === "/"}
                          />
                          <Routes>
                            <Route index element={<BienvenidaL />} />
                            <Route path="/archivosLider" element={<ArchivosL />} />
                            <Route
                              path="/contraseñasLider"
                              element={<ContraseñasL />}
                            />
                            <Route path="/empleadosLider" element={<EmpleadosL />} />
                          </Routes>
                        </Container>
                      </>
                    ) : user.usuario.role.name === "empleado" ? (
                      <>
                        <Container
                          fluid={isWelcomePage}
                          style={{
                            padding: isWelcomePage ? 0 : "0px",
                            background: isWelcomePage ? "blue" : "none",
                            maxWidth: "100%"
                          }}
                        >
                          <NavbarE
                            isWelcomePage={window.location.pathname === "/"}
                          />
                          <Routes>
                            <Route index element={<BienvenidaE />} />
                            <Route path="/archivosEmpleado" element={<ArchivosE />} />
                          </Routes>
                        </Container>
                      </>
                    ) : null}
                  </>
                ) : (
                  <InactiveUser />
                )}
              </>
            ) : (
              <LoginScreen />
            )
          }
        />
      </Routes>
    </Router>
  );  
};

export default AppRouter;
