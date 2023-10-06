import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import Usuario from '../../../../assets/Usuario.png';
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from "../../../../shared/plugins/axios";
import FeatherIcon from "feather-icons-react";
import Alert, {
  confirmMsj,
  confirmTitle,
  errorMsj,
  errorTitle,
  successMsj,
  successTitle,
} from "../../../../shared/plugins/alerts";
import Dropzone from 'react-dropzone';
import admin from "../../../../shared/CSS/admin.css";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export const EdtEmpleado = ({ isOpen, setUsuarios, onclose, users }) => {
  const [empleados, setEmpleados] = useState([]);
  const [profileImage, setProfileImage] = useState(Usuario);
  const [ProfilePhoto, setProfilePhoto] = useState("");
  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const handlePhoneChange = (event) => {
    const phoneNumber = event.target.value;

    // Define una expresión regular para validar números telefónicos (puedes ajustarla según tu necesidad)
    const phonePattern = /^[0-9]*$/;

    if (!phonePattern.test(phoneNumber)) {
      form.setFieldValue('phone', phoneNumber.replace(/[^0-9]/g, '')); // Elimina caracteres no numéricos
    } else {
      form.setFieldValue('phone', phoneNumber);
    }
  };

  const handleUrlMeetChange = (event) => {
    const urlMeet = event.target.value;

    // Define una expresión regular para validar enlaces URL
    const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?$/;

    if (!urlPattern.test(urlMeet)) {
      form.setFieldValue('urlMeet', urlMeet); // Actualiza el valor solo si es un enlace válido
    } else {
      form.setFieldValue('urlMeet', '');
    }
  };


  const handleEmailChange = (event) => {
    const email = event.target.value;

    // Define una expresión regular para validar correos electrónicos
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      form.setFieldValue('email', email); // Actualiza el valor solo si es un correo válido
    } else {
      form.setFieldValue('email', '');
    }
  };

  useEffect(() => {
    document.title = "ARCON";
  }, []);

  const getEmpleados = async () => {
    try {
      const data = await AxiosClientWithInterceptors({ url: "/user/" });
      if (!data.error) {
        setEmpleados(data.data);
      }
    } catch (error) {
      console.log("No hay registro de Empleados", error);
    }
  };

  const getRoles = async () => {
    try {
      const response = await AxiosClientWithInterceptors({ url: "/role/" });
      if (!response.error) {
        setRoles(response.data);
      }
    } catch (error) {
      console.log("Error roles:", error);
    }
  };

  const getAreas = async () => {
    try {
      const response = await AxiosClientWithInterceptors({ url: "/area/" });
      if (!response.error) {
        setAreas(response.data);
      }
    } catch (error) {
      console.log("Error area:", error);
    }
  };


  const handleImageChange = (files) => {
    if (files && files.length > 0) {
      setProfilePhoto(files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getEmpleados();
      await getRoles();
      await getAreas();
    };
    fetchData();
  }, []);


  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-])|(\\([0-9]{2,3}\\)[ \\-])|([0-9]{2,4})[ \\-])?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  // Captura los valores de los valores y también hace que los campos sean obligatorios
  const form = useFormik({
    initialValues: {
      name: "",
      surname: "",
      lastname: "",
      birthdate: "",
      email: "",
      phone: "",
      password: "",
      urlMeet: "",
      role: "",
      area: "",
      status: true,
    },
    onSubmit: async (values) => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("surname", values.surname);
      formData.append("lastname", values.lastname);
      formData.append("birthdate", values.birthdate);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      formData.append("urlMeet", values.urlMeet);
      formData.append("role", values.role);
      formData.append("area", values.area);
      formData.append("status", values.status);
      if (ProfilePhoto) {
        formData.append("ProfilePhoto", ProfilePhoto);
      }

      try {
        const response = await AxiosClientWithInterceptors.put(`/user/${users.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!response.error) {
          setUsuarios((usuarios) => [response.data, ...usuarios]);
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

  React.useEffect(() => {
    const {
      name,
      surname,
      lastname,
      birthdate,
      email,
      phone,
      password,
      urlMeet,
    } = users;
    form.setValues({
      name,
      surname,
      lastname,
      birthdate,
      email,
      phone,
      password,
      urlMeet,
      status: users.status,
    });
  }, [users]);


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
      <Modal.Body className="pink-modal">
        <Modal.Title style={{ marginBottom: "20px" }}>
          | Editar empleado
        </Modal.Title>
        <Form onSubmit={form.handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre (s):</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={form.values.name}
                  onChange={form.handleChange}
                  className="custom-input"
                  style={{
                    border: "2px solid #151F30",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {form.errors.name && (
                  <span className="error-text">{form.errors.name}</span>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellido Paterno</Form.Label>
                <Form.Control
                  name="lastname"
                  value={form.values.lastname}
                  onChange={form.handleChange}
                  className="custom-input"
                  style={{
                    border: "2px solid #151F30",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {form.errors.lastname && (
                  <span className="error-text">{form.errors.lastname}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apellido Materno</Form.Label>
                <Form.Control
                  name="surname"
                  value={form.values.surname}
                  onChange={form.handleChange}
                  className="custom-input"
                  style={{
                    border: "2px solid #151F30",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {form.errors.surname && (
                  <span className="error-text">{form.errors.surname}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de nacimiento:</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={form.values.birthdate}
                  onChange={form.handleChange}
                  className="custom-input"
                  style={{
                    border: "2px solid #151F30",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {form.errors.birthdate && (
                  <span className="error-text">{form.errors.birthdate}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.values.email}
                  onChange={handleEmailChange} // Cambio en el manejador de cambio
                  className="custom-input"
                  style={{
                    border: "2px solid #151F30",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {form.errors.email && (
                  <span className="error-text">{form.errors.email}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono:</Form.Label>
                <Form.Control
                  type="tel"
                  value={form.values.phone}
                  onChange={handlePhoneChange} // Cambio en el manejador de cambio
                  className="custom-input"
                  style={{
                    border: "2px solid #151F30",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {form.errors.phone && (
                  <span className="error-text">{form.errors.phone}</span>
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
                <Form.Label>Meet:</Form.Label>
                <Form.Control
                  type="text"
                  name="urlMeet"
                  value={form.values.urlMeet}
                  onChange={handleUrlMeetChange}
                  className="custom-input"
                  style={{
                    border: "2px solid #151F30",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {form.errors.urlMeet && (
                  <span className="error-text">{form.errors.urlMeet}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rol:</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={form.values.role}
                  onChange={form.handleChange}
                  className="custom-input"
                  style={{
                    border: "2px solid #151F30",
                    borderRadius: "20px",
                    background: "transparent",
                    width: "170px",
                    color: "white",
                  }}
                >
                  <option value="" style={{ backgroundColor: "#151F30", borderRadius: "20px" }}>Seleccione un rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id} style={{ backgroundColor: "#151F30", borderRadius: "20px" }}>
                      {role.name}
                    </option>
                  ))}
                </Form.Control>
                {form.errors.role && (
                  <span className="error-text">{form.errors.role}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Area:</Form.Label>
                <Form.Control
                  as="select"
                  name="area"
                  value={form.values.area}
                  onChange={form.handleChange}
                  className="custom-input"
                  style={{
                    border: "2px solid #151F30",
                    borderRadius: "20px",
                    background: "transparent",
                    width: "170px",
                    color: "white",
                  }}
                >
                  <option value="" style={{ backgroundColor: "#151F30", borderRadius: "20px" }}>Seleccione un area</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id} style={{ backgroundColor: "#151F30", borderRadius: "20px" }}>
                      {area.name}
                    </option>
                  ))}
                </Form.Control>
                {form.errors.role && (
                  <span className="error-text">{form.errors.role}</span>
                )}
              </Form.Group>
            </Col>
            <Col md={4} className="text-center">
              <div>
                <img
                  src={profileImage} // Mostrar la imagen de perfil seleccionada o la existente
                  width="150"
                  height="150"
                  className="d-inline-block align-top"
                  alt="Foto de Perfil"
                />
              </div>
              <div>
                <Dropzone onDrop={handleImageChange}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Button variant="secondary">Cambiar foto</Button>
                    </div>
                  )}
                </Dropzone>
              </div>
            </Col>

          </Row>
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

export default EdtEmpleado;