import React, { useState, useContext } from "react";
import {
    Card,
    Container,
    Figure,
    Form,
    Row,
    Col,
    Button,
} from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { Navigate, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { AuthContext } from "./authContext";
import Alert, {
    confirmMsj,
    confirmTitle,
    errorMsj,
    errorTitle,
    successMsj,
    successTitle,
} from "../../shared/plugins/alerts";
import logoh from "../../assets/logoh.png";
import login from "../../shared/CSS/Login.css";
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from "../../shared/plugins/axios";


const RecoveryPassword = () => {
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false)
    const correo = localStorage.getItem("email")
    const obj = JSON.parse(correo);
    const correoelectronico = obj.email;
    // console.log('reset_password_token',localStorage.getItem("reset_password"))
    // console.log(correoelectronico);
    const tokenReset = localStorage.getItem("reset_password")
    const formik = useFormik({
        initialValues: {
            email: correoelectronico,
            newPassword: "",
            secretPass: ""
        },
        validationSchema: yup.object().shape({
            newPassword: yup
                .string()
                .required("Campo Obligatorio")
                .min(8, "Minimo 8 Carecteres"),
            secretPass: yup.string().required('Campo Obligatorio')
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const response = await AxiosClientWithInterceptors({
                    url: "recovery/updatePassword",
                    method: "PUT",
                    data: JSON.stringify(values),
                    headers: { Authorization: `Bearer ${tokenReset}` }
                });

                if (!response.error) {
                    Alert.fire({
                        title: "Contraseña Actualizada",
                        text: "Ya puedes iniciar Sesión con tu nueva contraseña",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Aceptar",
                    });
                    navigation("/auth", { replace: true });
                } else {
                    throw Error();
                }
            } catch (error) {
                Alert.fire({
                    title: "Contraseña No Valida",
                    text: "Vuelve a ingresar la contraseña",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Aceptar",
                });
            }
        },
    });

    return (

        <div className="login-container d-flex justify-content-center align-items-center">
            <Card className="bg-secondary">
                <Card.Body className="p-md-4 mx-md-5">
                    <div className="d-flex align-items-center justify-content-center ">
                        <Figure className="mx-1 mb-2 ">
                            <Figure.Image
                                width={150}
                                height={150}
                                alt="ARCON"
                                src={logoh}
                            />
                        </Figure>
                        <div>
                            <h3 className="mt-1 mb-3 pb-2 text-white"> | Cuenta</h3>
                        </div>
                    </div>
                    <h4 className="mt-1 mb-4 text-white text-center">Recuperar Contraseña</h4>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="form-outline mb-4">
                            <Form.Label htmlFor="secretPass" className=" text-white mb-0">Palabra clave </Form.Label>
                            <Form.Control
                                id="newPasswsecretPassord"
                                autoComplete="off"
                                name="secretPass"
                                style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    borderBottom: "3px solid #1971AB",
                                    color: "white",
                                }}
                                className="mb-3"
                                value={formik.values.secretPass}
                                onChange={formik.handleChange}
                            />{formik.errors.secretPass ? (
                                <span className="error-text">
                                    {formik.errors.secretPass}
                                </span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="form-outline mb-4">
                            <Form.Label htmlFor="newPassword" className=" text-white mb-0">Nueva contraseña</Form.Label>

                            <Form.Control
                                type="password"
                                id="newPassword"
                                autoComplete="off"
                                name="newPassword"
                                className="mb-3"
                                style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    borderBottom: "3px solid #1971AB",
                                    color: "white",
                                }}
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.newPassword ? (
                                <span className="error-text">
                                    {formik.errors.newPassword}
                                </span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="form-outline mb-4">
                            <div className="text-center pt-4">
                                <Button
                                    variant="primary"
                                    className="btn-hover "
                                    type="submit"
                                    disabled={!(formik.isValid && formik.dirty)}
                                >
                                    <FeatherIcon
                                        icon={"log-in"}
                                    />
                                    &nbsp; Enviar
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RecoveryPassword;