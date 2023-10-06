import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Button, Form, Modal, Col, Row, Image } from "react-bootstrap";
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
import Usuario from '../../../../assets/Usuario.png';
import Dropzone from 'react-dropzone';
import { faPray } from "@fortawesome/free-solid-svg-icons";

export const EmpleadosForm = ({ isOpen, setUsuarios, onclose }) => {
  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [ProfilePhoto, setProfilePhoto] = useState(null);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [urlMeet, setUrlMeet] = useState("");
  const [role, setRole] = useState(1)
  const [area, setArea] = useState(1);
  const [nameError, setNameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [urlMeetError, setUrlMeetError] = useState("");
  const [roleError, setRoleError] = useState("");

  function formatDateToYYYYMMDD(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  const getRoles = async () => {
    try {
      const data = await AxiosClientWithInterceptors({ url: "/role/" });
      if (!data.error) {
        setRoles(data.data);
      }
    } catch (error) {
      console.log("No hay registro rol", error);
    }
  };

  useEffect(() => {
    document.title = "ARCON";
  }, []);


  const getAreas = async () => {
    try {
      const data = await AxiosClientWithInterceptors({ url: "/area/" });
      if (!data.error) {
        setAreas(data.data);
      }
    } catch (error) {
      console.log("No hay registro areas", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getRoles();
      await getAreas();
    };
    fetchData();
  }, []);

  const handleImageChange = (files) => {
    if (files && files.length > 0) {
      setProfilePhoto(files[0]);
      const reader = new FileReader();
      reader.onload = () => {
      };
      reader.readAsDataURL(files[0]);
    }
  };

    // Define la expresión regular para validar enlaces
const urlRegExp = /^(ftp|http|https):\/\/[^ "]+$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar los errores de validación
    if (
      !name || nameError ||
      !lastname || lastnameError ||
      !birthdate || birthdateError ||
      !surname || surnameError ||
      !email || emailError ||
      !password || passwordError ||
      !selectedRole.id || roleError ||
      !selectedArea.id ||
      !urlMeet || urlMeetError
    ) {
      Alert.fire({
        title: errorTitle,
        text: "Por favor, complete todos los campos obligatorios correctamente.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Continuar con el envío del formulario si no hay errores de validación
    const formData = new FormData();
    formData.append("ProfilePhoto", ProfilePhoto);
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("surname", surname);
    formData.append("birthdate", formatDateToYYYYMMDD(birthdate));
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", selectedRole.id);
    formData.append("area", selectedArea.id);
    formData.append("urlMeet", urlMeet);
    formData.append("status", status);

    try {
      console.log("formData:", formData);
      const response = await AxiosClientWithoutInterceptors.post("/user/", formData, {
        headers: { "Content-Type": "multipart/formData" },
      });

      console.log("Respuesta exitosa:", response);

      if (!response.error) {
        setUsuarios((usuarios) => [response.data, ...usuarios]);
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
          window.location.reload();
        }
      });
    }
  };

  const handleClose = () => {
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
        <Form onSubmit={handleSubmit.handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre (s):</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!e.target.value) {
                      setNameError("Campo obligatorio");
                    } else {
                      setNameError("");
                    }
                  }}
                  className={`custom-input ${nameError ? "is-invalid" : ""}`}
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {nameError && <div className="invalid-feedback">{nameError}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apellido Paterno:</Form.Label>
                <Form.Control
                  name="lastname"
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                    if (!e.target.value) {
                      setLastnameError("Campo obligatorio");
                    } else {
                      setLastnameError("");
                    }
                  }}
                  className={`custom-input ${lastnameError ? "is-invalid" : ""}`}
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {lastnameError && <div className="invalid-feedback">{lastnameError}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apellido Materno:</Form.Label>
                <Form.Control
                  name="surname"
                  value={surname}
                  onChange={(e) => {
                    setSurname(e.target.value);
                    if (!e.target.value) {
                      setSurnameError("Campo obligatorio");
                    } else {
                      setSurnameError("");
                    }
                  }}
                  className={`custom-input ${surnameError ? "is-invalid" : ""}`}
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {surnameError && <div className="invalid-feedback">{surnameError}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Nacimiento:</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={birthdate}
                  onChange={(e) => {
                    setBirthdate(e.target.value);
                    if (!e.target.value) {
                      setBirthdateError("Campo obligatorio");
                    } else {
                      setBirthdateError("");
                    }
                  }}
                  className={`custom-input ${birthdateError ? "is-invalid" : ""}`}
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {birthdateError && <div className="invalid-feedback">{birthdateError}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!e.target.value) {
                      setEmailError("Campo obligatorio");
                    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(e.target.value)) {
                      setEmailError("Correo electrónico no válido");
                    } else {
                      setEmailError("");
                    }
                  }}
                  className={`custom-input ${emailError ? "white-error-message" : ""}`}
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {emailError && <div className="white-error-message">{emailError}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono:</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  className={`custom-input ${phoneError ? "is-invalid" : ""}`}
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {phoneError && <div className="invalid-feedback" style={{ color: "white" }}>{phoneError}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!e.target.value) {
                      setPasswordError("Campo obligatorio");
                    } else {
                      setPasswordError("");
                    }
                  }}
                  className={`custom-input ${passwordError ? "is-invalid" : ""}`}
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {passwordError && <div className="invalid-feedback">{passwordError}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Meet:</Form.Label>
                <Form.Control
                  type="text"
                  name="urlMeet"
                  value={urlMeet}
                  onChange={(e) => {
                    setUrlMeet(e.target.value);
                    if (!urlRegExp.test(e.target.value)) {
                      setUrlMeetError("Enlace no válido");
                    } else {
                      setUrlMeetError("");
                    }
                  }}
                  className={`custom-input ${urlMeetError ? "is-invalid" : ""}`}
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {urlMeetError && <div className="invalid-feedback" style={{ color: "white" }}>{urlMeetError}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rol:</Form.Label>
                <Form.Control
                  as="select"
                  name="role.id"
                  value={selectedRole.id}
                  onChange={(e) => {
                    const selectedRoleId = Number(e.target.value);
                    const selectedRole = roles.find((role) => role.id === selectedRoleId);
                    setSelectedRole(selectedRole);

                    if (!selectedRoleId) {
                      setRoleError("Selecciona un rol");
                    } else {
                      setRoleError("");
                    }
                  }}
                  className={`custom-input ${roleError ? "is-invalid" : ""}`}
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    width: "170px",
                    color: "white",
                  }}
                >
                  <option style={{ backgroundColor: "#1971AB", borderRadius: "20px" }}>
                    Seleccionar:
                  </option>
                  {roles.map((rol) => (
                    <option
                      key={rol.id}
                      value={rol.id}
                      style={{ backgroundColor: "#1971AB ", borderRadius: "20px" }}
                    >
                      {rol.name}
                    </option>
                  ))}
                </Form.Control>
                {roleError && <div className="invalid-feedback">{roleError}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Area:</Form.Label>
                <Form.Control
                  as="select"
                  name="area.id"
                  value={selectedArea.id}
                  onChange={(e) => {
                    const selectAreaId = Number(e.target.value);
                    const selectArea = areas.find((area) => area.id === selectAreaId);
                    setSelectedArea(selectArea);
                  }}
                  className="custom-input"
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    width: "170px",
                    color: "white",
                  }}
                >
                  <option style={{ backgroundColor: "#1971AB", borderRadius: "20px" }}>
                    Seleccionar:
                  </option>
                  {areas.map((area) => (
                    <option
                      key={area.id}
                      value={area.id}
                      style={{ backgroundColor: "#1971AB", borderRadius: "20px" }}
                    >
                      {area.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col >
            <Col md={4} className="text-center">
              {/* Imagen de perfil */}
              <div>
                <img
                  src={ProfilePhoto ? URL.createObjectURL(ProfilePhoto) : Usuario}
                  width="150"
                  height="150"
                  className="d-inline-block align-top"
                  alt="Profile Picture"
                  style={{ marginBottom: "20px" }}
                />
              </div>

              {/* Cambiar foto */}
              <div>
                <Form.Group className="mb-3">
                  <Dropzone onDrop={handleImageChange}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Button variant="light">Agregar foto</Button>
                      </div>
                    )}
                  </Dropzone>
                  {ProfilePhoto === null && (
                    <div className="invalid-feedback">Selecciona una foto de perfil</div>
                  )}
                </Form.Group>
              </div>
            </Col>

          </Row >
          <Form.Group className="mb-3">
            <Row>
              <Col className="text-end">
                <Button className="me-2" variant="light" onClick={handleClose}>
                  Cerrar
                </Button>
                <Button onClick={handleSubmit} variant="primary">
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form >
      </Modal.Body >
    </Modal >
  );
};

export default EmpleadosForm;