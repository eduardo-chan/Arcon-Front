import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { AuthContext } from "./authContext";
import { Figure, Form, Button } from "react-bootstrap";
import logo from "../../assets/logo.png";
import FeatherIcon from "feather-icons-react";
import InputGroup from "react-bootstrap/InputGroup";
import {login} from "../../shared/CSS/Login.css";
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from '../../shared/plugins/axios';
import * as yup from "yup";
import Alert from "../../shared/plugins/alerts";

function LoginScreen() {
  const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().required("Campo obligatorio"),
      password: yup.string().required("Campo obligatorio"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await AxiosClientWithInterceptors({
          url: "/auth/login",
          method: "POST",
          data: JSON.stringify(values),
        });
        if (!response.error) {
          const action = {
            type: "LOGIN",
            payload: response.data,
          };
          dispatch(action);
          navigation("/", { replace: true });
        } else {
          throw Error();
        }
      } catch (err) {
        Alert.fire({
          title: "Verificar datos",
          text: "Usuario y/o contraseña incorrectos",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  useEffect(() => {
    document.title = "ARCON";
  }, []);

  if (user.isLogged) {
    return <Navigate to={"/"} />;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="login-form">
          <div className="text-center">
            <Figure>
              <Figure.Image width={225} height={210} alt="logo" src={logo} />
            </Figure>
          </div>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-4 p-3">
              <InputGroup hasValidation>
                <InputGroup.Text
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                >
                  <FeatherIcon className="input-icon" icon="user" />
                </InputGroup.Text>
                <Form.Control
                  id="email"
                  autoComplete="off"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="mx-3"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: "3px solid #1971AB",
                    color: "white",
                  }}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4 p-3">
              <InputGroup hasValidation>
                <InputGroup.Text
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={togglePasswordVisibility}
                >
                  <FeatherIcon
                    className="input-icon"
                    icon={showPassword ? "unlock" : "lock"}
                  />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="off"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="mx-3"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: "3px solid #1971AB",
                    color: "white",
                  }}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="form-outline mb-4">
              <div className="text-center pt-1 pb-1">
                <a href="/password" className="text-white ">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </Form.Group>
            <Form.Group className="mb-4 login-form form button">
              <div className="text-center pt-1 pb-1">
                <Button
                  variant="primary"
                  className="btn-hover "
                  type="submit"
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  <FeatherIcon icon="log-in" />
                  &nbsp; Iniciar sesión
                </Button>
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>
      <div className="right-side"></div>
    </div>
  );
}

export default LoginScreen;