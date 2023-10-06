import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Button, Form, Modal, Col, Row } from "react-bootstrap";
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

export const ContraseñasForm = ({
  isOpen,
  setContraseñas,
  onclose,
  aparta,
}) => {
  const [sites, setSites] = useState([]);
  const [apartados, setApartados] = useState([]);

  const getSites = async () => {
    try {
      const data = await  AxiosClientWithInterceptors({ url: "/site/" });
      if (!data.error) {
        setSites(data.data);
      }
    } catch (error) {
      console.log("No hay registro contraseñas registradas", error);
    }
  };

  useEffect(() => {
    document.title = "ARCON";
  }, []);

  const getApartados = async () => {
    try {
      const data = await  AxiosClientWithInterceptors({ url: "/apartado/" });
      if (!data.error) {
        setApartados(data.data);
      }
    } catch (error) {
      console.log("No hay registro de apartados registrados", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getSites();
      await getApartados();
    };
    fetchData();
  }, []);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const form = useFormik({
    initialValues: {
      nameClient: "",
      description: "",
      userSite: "",
      password: "",
      ubicacion: "",
      status: true,
    },
    validationSchema: yup.object().shape({
      nameClient: yup
        .string()
        .required("Campo obligatorio")
        .min(8, "Mínimo 8 caracteres"),
      description: yup
        .string()
        .required("Campo obligatorio")
        .min(15, "Mínimo 15 caracteres"),
      userSite: yup
        .string()
        .required("Campo obligatorio")
        .min(4, "Mínimo 4 caracteres"),
      password: yup
        .string()
        .required("Campo obligatorio")
        .min(8, "Mínimo 8 caracteres"),
      ubicacion: yup
        .string()
        .required("Campo obligatorio")
        .min(5, "Mínimo 5 caracteres"),
    }),
    onSubmit: async (values) => {
      return Alert.fire({
        title: "¿Está seguro de registrar la contraseña?",
        text: confirmMsj,
        icon: "warning",
        confirmButtonColor: "#009574",
        confirmButtonText: "Aceptar",
        cancelButtonColor: "#DD6B55",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        backdrop: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Alert.isLoading,
        preConfirm: async () => {
          try {
            const response = await  AxiosClientWithInterceptors({
              method: "POST",
              url: "/site/",
              data: JSON.stringify(values),
            });
            if (!response.error) {
              setContraseñas((contraseñas) => [response.data, ...contraseñas]);
              Alert.fire({
                title: "Registro realizada exitosamente",
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
            return response;
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
    },
  });

  const handleClose = () => {
    form.resetForm();
    onclose();
  };

  return (
    <Modal
      show={isOpen}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
      onHide={handleClose}
    >
      <Modal.Body className="blue-modal">
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ marginBottom: "20px" }}
        >
          | Registrar
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
                border: "2px solid #1971AB",
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
            <Form.Label>Usuario sitio :</Form.Label>
            <Form.Control
              name="userSite"
              value={form.values.userSite}
              onChange={form.handleChange}
              className="custom-input"
              style={{
                border: "2px solid #1971AB",
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
                border: "2px solid #1971AB",
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
                border: "2px solid #1971AB",
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
            <Form.Control
              as="select" // Use select input for dropdown
              name="apartado"
              value={form.values.apartado}
              onChange={form.handleChange}
              className="custom-input"
              style={{
                border: "2px solid #1971AB",
                borderRadius: "20px",
                background: "transparent",
                color: "white",
              }}
            >
              <option
                value=""
                style={{ backgroundColor: "#192B3E ", borderRadius: "20px" }}
              >
                Seleccione un apartado
              </option>
              {apartados.map((apartado) => (
                <option
                  key={apartado.id}
                  value={apartado.id}
                  style={{ backgroundColor: "#192B3E ", borderRadius: "20px" }}
                >
                  {apartado.name}
                </option>
              ))}
            </Form.Control>
            {form.errors.apartado && (
              <span className="error-text">{form.errors.apartado}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción:</Form.Label>
            <Form.Control
              as="textarea" // Indicamos que queremos un textarea en lugar de un input
              rows={5} // Número de filas para el textarea
              name="description"
              value={form.values.description}
              onChange={form.handleChange}
              className="custom-input"
              style={{
                border: "2px solid #1971AB",
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

export default ContraseñasForm;
