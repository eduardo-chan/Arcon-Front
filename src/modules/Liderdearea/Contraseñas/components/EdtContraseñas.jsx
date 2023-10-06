import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import * as yup from "yup";
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from "../../../../shared/plugins/axios";
import Alert, {
  confirmMsj,
  confirmTitle,
  errorMsj,
  errorTitle,
  successMsj,
  successTitle,
} from "../../../../shared/plugins/alerts";
import admin from "../../../../shared/CSS/admin.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const EdtContraseñas = ({
  isOpen,
  setContraseñas,
  onclose,
  users,
  apartados,
}) => {
  const [sites, setSites] = useState([]);

  const getSites = async () => {
    try {
      const data = await AxiosClientWithInterceptors({ url: "/site/" });
      if (!data.error) {
        setSites(data.data);
      }
    } catch (error) {
      console.log("No hay registro de contraseñas registradas", error);
    }
  };

  useEffect(() => {
    document.title = "ARCON";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getSites();
    };
    fetchData();
  }, []);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


  useEffect(() => {
    if (users) {
      form.setValues({
        id: users.id,
        nameClient: users.nameClient,
        description: users.description,
        userSite: users.userSite,
        password: users.password,
        ubicacion: users.ubicacion,
        status: users.status,
        apartado: users.apartado,
      });
    }
  }, [users]);

  const handleClose = () => {
    form.resetForm();
    onclose();
  };

  const form = useFormik({
    initialValues: {
      id: "",
      nameClient: "",
      description: "",
      userSite: "",
      password: "",
      ubicacion: "",
      status: true,
      apartado: "",
    },
    validationSchema: yup.object().shape({
      nameClient: yup.string().required("Campo obligatorio").min(8, "Mínimo 8 caracteres"),
      description: yup.string().required("Campo obligatorio").min(15, "Mínimo 15 caracteres"),
      userSite: yup.string().required("Campo obligatorio").min(4, "Mínimo 4 caracteres"),
      password: yup.string().required("Campo obligatorio").min(8, "Mínimo 8 caracteres"),
      ubicacion: yup.string().required("Campo obligatorio").min(5, "Mínimo 5 caracteres"),
      apartado: yup.string().required("Campo obligatorio"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await AxiosClientWithInterceptors({
          method: "PUT",
          url: "/site/",
          data: JSON.stringify(values),
        });

        if (!response.error) {
          setContraseñas((contraseñas) => [response.data, ...contraseñas]);
          Alert.fire({
            title: "Actualización realizada exitosamente",
            text: successMsj,
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.isConfirmed) {
              handleClose();
              window.location.reload();
            }
          });
        }
      } catch (error) {
        Alert.fire({
          title: errorTitle,
          text: errorMsj,
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.isConfirmed) {
            handleClose();
          }
        });
      }
    },
  });

  return (
    <Modal
      show={isOpen}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
      onHide={handleClose}
    >
      <Modal.Body className="pink-modal">
        <Modal.Title style={{ marginBottom: "20px" }}>
          | Editar contraseña
        </Modal.Title>
        <Form onSubmit={form.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del cliente:</Form.Label>
            <Form.Control
              type="text"
              name="nameClient"
              value={form.values.nameClient}
              onChange={form.handleChange}
              className="custom-input"
              style={{
                border: "2px solid #151F30",
                borderRadius: "20px",
                background: "transparent",
                color: "white",
              }}
            />
            {form.errors.nameClient && (
              <span className="error-text">{form.errors.nameClient}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Usuario sitio: </Form.Label>
            <Form.Control
              name="userSite"
              value={form.values.userSite}
              onChange={form.handleChange}
              className="custom-input"
              style={{
                border: "2px solid #151F30",
                borderRadius: "20px",
                background: "transparent",
                color: "white",
              }}
            />
            {form.errors.userSite && (
              <span className="error-text">{form.errors.userSite}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.values.password}
              onChange={form.handleChange}
              className="custom-input"
              style={{
                border: "2px solid #151F30",
                borderRadius: "20px",
                background: "transparent",
                color: "white",
              }}
            />
            {form.errors.password && (
              <span className="error-text">{form.errors.password}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ubicación:</Form.Label>
            <Form.Control
              type="text"
              name="ubicacion"
              value={form.values.ubicacion}
              onChange={form.handleChange}
              className="custom-input"
              style={{
                border: "2px solid #151F30",
                borderRadius: "20px",
                background: "transparent",
                color: "white",
              }}
            />
            {form.errors.ubicacion && (
              <span className="error-text">{form.errors.ubicacion}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apartado:</Form.Label>
            <Form.Select
              name="apartado"
              value={form.values.apartado}
              onChange={form.handleChange}
              className="custom-input"
              style={{
                border: "2px solid #151F30",
                borderRadius: "20px",
                background: "transparent",
                color: "white",
              }}
            >
              <option value="" style={{ backgroundColor: "#192B3E", borderRadius: "20px" }}>Seleccionar apartado</option>
              {apartados.map((apartado) => (
                <option key={apartado.id} value={apartado.id} style={{ backgroundColor: "#192B3E", borderRadius: "20px" }}>
                  {apartado.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              value={form.values.description}
              onChange={form.handleChange}
              className="custom-input"
              style={{
                border: "2px solid #151F30",
                borderRadius: "20px",
                background: "transparent",
                color: "white",
              }}
            />
            {form.errors.description && (
              <span className="error-text">{form.errors.description}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Row>
              <Col className="text-end">
                <Button className="me-2" variant="light" onClick={handleClose}>
                  {" "}
                  &nbsp;Cerrar
                </Button>
                <Button type="submit" variant="primary">
                  {" "}
                  &nbsp;Guardar
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EdtContraseñas;
