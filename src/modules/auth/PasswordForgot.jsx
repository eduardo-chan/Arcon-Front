import React, { useContext } from "react";
import {
  Card,
  Container,
  Figure,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { Navigate, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import FeatherIcon from "feather-icons-react";
import logoh from "../../assets/logoh.png";
import login from "../../shared/CSS/Login.css";
import { AuthContext } from "./authContext";
import Alert, {
  confirmMsj,
  confirmTitle,
  errorMsj,
  errorTitle,
  successMsj,
  successTitle,
} from "../../shared/plugins/alerts";
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from "../../shared/plugins/axios";

const PasswordForgot = () => {
  const navigation = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: yup.object().shape({
      email: yup.string().required('Campo Obligatorio')
    }),
    onSubmit: async (values) => {
      // console.log(values);
      try {
        const response = await AxiosClientWithInterceptors({
          url: '/recovery/',
          method: 'POST',
          data: JSON.stringify(values)
        })
        if (!response.error) {
          localStorage.setItem("email", JSON.stringify(values))
          localStorage.setItem("reset_password", response.data.reset_password_token)
          // console.log(localStorage.getItem("email"));
          // console.log('reset_password_token',localStorage.getItem("reset_password"))
          const action = {
            type: 'EMAIL',
            payload: response.data
          }
          Alert.fire({
            title: 'Palabra clave enviada',
            text: 'Haz solicitado Cambiar tu Contraseña!',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
          });
          dispatch(action)
          navigation('/recovery', { replace: true });
        } else {
          throw Error()
        }
      } catch (error) {
        Alert.fire({
          title: 'Verificar datos',
          text: 'Usuario no Existente',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  })

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <Card className="bg-secondary">
        <Card.Body className="p-md-5 mx-md-4">
          <div className="d-flex align-items-center justify-content-center ">
            <Figure className="mx-1 mb-2 ">
              <Figure.Image
                width={150}
                height={150}
                alt="Arcon"
                src={logoh}
              />
            </Figure>
            <div>
              <h3 className="mt-1 mb-3 pb-2 text-white"> | Cuenta</h3>
            </div>
          </div>
          <h4 className="mt-1 mb-5 text-white text-center">Recuperar Contraseña</h4>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="form-outline mb-4">
              <Form.Label htmlFor="email" className=" text-white">
                Correo electrónico
              </Form.Label>
              <Form.Control
                id="email"
                autoComplete="off"
                name="email"
                required
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "3px solid #1971AB",
                  color: "white",
                }}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email ? (
                <span className="error-text">
                  {formik.errors.email}
                </span>
              ) : null}
            </Form.Group>
            <Form.Group className="form-outline mb-4 login-form form button">
              <div className="text-center pt-4">
                <Button
                  variant="primary"
                  className="btn-hover"
                  type="submit"
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  <FeatherIcon icon={"log-in"} />
                  &nbsp; Enviar
                </Button>
              </div>
            </Form.Group>
            <Form.Group className="form-outline mb-4">
              <div className="text-end pt-1 pb-1">
                <a href="/auth" className="btn btn-light">
                  Volver
                </a>
              </div>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div >
  );
};

export default PasswordForgot;