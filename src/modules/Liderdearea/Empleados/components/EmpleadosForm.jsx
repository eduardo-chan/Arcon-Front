import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../../auth/authContext"
export const EmpleadosForm = ({ isOpen, setUsuarios, onclose }) => {
  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const { user } = useContext(AuthContext);

  const [areaId, setAreaId] = useState({
    area: user.usuario.area.id,
})

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
  const [role, setRole] = useState(3)
  const [area, setArea] = useState(user.usuario.area.id)

  // const [role, setRole] = useState({
  //   id: 0,
  //   name: "",
  // });
  // const [area, setArea] = useState({
  //   id: 0,
  //   name: "",
  // });

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
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("ProfilePhoto", ProfilePhoto);
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("surname", surname);
    formData.append("birthdate", formatDateToYYYYMMDD(birthdate));
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("area", area);
    formData.append("urlMeet", urlMeet);
    formData.append("status", status);
    try {
      console.log("formData:", formData);
      const response = await AxiosClientWithoutInterceptors.post("/user/", formData, {
        headers: { "Content-Type": "multipart/formData" }
      })

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
    // formik.resetForm();
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
                  onChange={(e) => setName(e.target.value)}
                  className="custom-input"
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {/* {form.errors.name && (
                  <span className="error-text">{form.errors.name}</span>
                )} */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apellido Paterno:</Form.Label>
                <Form.Control
                  name="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="custom-input"
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {/* {form.errors.lastname && (
                  <span className="error-text">{form.errors.lastname}</span>
                )} */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apellido Materno:</Form.Label>
                <Form.Control
                  name="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="custom-input"
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {/* {form.errors.surname && (
                  <span className="error-text">{form.errors.surname}</span>
                )} */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Nacimiento:</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="custom-input"
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {/* {form.errors.birthdate && (
                  <span className="error-text">{form.errors.birthdate}</span>
                )} */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="custom-input"
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {/* {form.errors.email && (
                  <span className="error-text">{form.errors.email}</span>
                )} */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono:</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="custom-input"
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {/* {form.errors.phone && (
                  <span className="error-text">{form.errors.phone}</span>
                )} */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="custom-input"
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {/* {form.errors.password && (
                  <span className="error-text">{form.errors.password}</span>
                )} */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Meet:</Form.Label>
                <Form.Control
                  type="text"
                  name="urlMeet"
                  value={urlMeet}
                  onChange={(e) => setUrlMeet(e.target.value)}
                  className="custom-input"
                  style={{
                    border: "2px solid #1971AB",
                    borderRadius: "20px",
                    background: "transparent",
                    color: "white",
                  }}
                />
                {/* {form.errors.urlMeet && (
                  <span className="error-text">{form.errors.urlMeet}</span>
                )} */}
              </Form.Group>
              {/* <Form.Group className="mb-3">
                <Form.Label>Rol:</Form.Label>
                <Form.Control
                  as="select"
                  name="role.id"
                  value={selectedRole}
                  onChange={(e) => {
                    const selectedRoleId = Number(e.target.value);
                    const selectedRole = roles.find((role) => role.id === selectedRoleId);
                    setSelectedRole(selectedRole);
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
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Area:</Form.Label>
                <Form.Control
                  as="select"
                  name="area.id"
                  value={selectedArea}
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
              </Form.Group> */}
            </Col>
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
                <Dropzone onDrop={handleImageChange}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Button  variant="light" >Agregar foto </Button>
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
                  Cerrar
                </Button>
                <Button onClick={handleSubmit} variant="primary">
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EmpleadosForm;