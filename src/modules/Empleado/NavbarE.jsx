import React, { useState, useEffect, useContext } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../../assets/logoh.png';
import Usuario from '../../assets/Usuario.png';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Button, Modal } from 'react-bootstrap';
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from '../../shared/plugins/axios';
import { AuthContext } from "../../modules/auth/authContext";
import { useNavigate } from "react-router-dom";
import { RiPencilFill } from "react-icons/ri";
import FeatherIcon from "feather-icons-react";
import Alert from 'sweetalert2';
import Dropzone from 'react-dropzone';
import { useFormik } from "formik";
import * as Yup from "yup";

//import CryptoJS from 'crypto-js';
import "../Liderdearea/Nav.css";
const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    surname: Yup.string().required("Los apellidos son obligatorios"),
    lastname: Yup.string().required("El apellido es obligatorio"),
    email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
    phone: Yup.string().required("El teléfono es obligatorio"),
    urlMeet: Yup.string().url("Enlace inválido").required("El enlace es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria"),
  });
  

function NavLider({ onclose, setUser }) {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [profileImage, setProfileImage] = useState(Usuario);
    const [ProfilePhoto, setProfilePhoto] = useState(null);
    const { user } = useContext(AuthContext);
    const expand = false;
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const successMsj = "Mensaje de éxito";
    const errorTitle = "Título del error";
    const errorMsj = "Mensaje de error";

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem('token');
        navigate("/auth", { replace: true });
        localStorage.setItem("saveSesion", false);
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
    const formik = useFormik({
        initialValues: {
            password: "",
            profilePhoto: null,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          // ...tu función onSubmit
        },
      });
      
    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };
    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; // Los meses en JavaScript van de 0 a 11
        const year = date.getUTCFullYear();

        // Asegurarse de que el día y el mes tengan dos dígitos
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    };


    const [editData, setEditData] = useState({
        name: user.usuario.name,
        surname: user.usuario.surname,
        lastname: user.usuario.lastname,
        email: user.usuario.email,
        phone: user.usuario.phone,
        urlMeet: user.usuario.urlMeet,
        password: user.usuario.password,
        birthdate: user.usuario.birthdate,
        role: user.usuario.role.id,
        area: user.usuario.area.id,
        status: user.usuario.status,
        token: user.usuario.token,
    });
    const handleEditProfile = () => {
        setShowEditModal(true);
        console.log('Role ID in handleEditProfile:', user.usuario.role.id);
        const formattedBirthdate = formatDate(user.usuario.birthdate);
        setEditData({
            ...editData,
            id: user.usuario.id,
            role: user.usuario.role.id,
            area: user.usuario.area.id,
            status: user.usuario.status,
            birthdate: formattedBirthdate,
            token: user.usuario.token,
        });
    };

    const handleEditInputChange = (e) => {
        const { id, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };
    // const encryptedPassword = editData.password;
    // const secretKey = 'tu_clave_de_encriptacion';

    // const decryptPassword = (encryptedPassword, secretKey) => {
    //     const decryptedBytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    //     const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);
    //     return decryptedPassword;
    // };

    // const decryptedPassword = decryptPassword(encryptedPassword, secretKey);
    // setEditData(prevData => ({
    //     ...prevData,
    //     password: decryptedPassword
    // }));
    console.log('Initial Role ID:', user.usuario.role.id);

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        if (editData.password === null || editData.password === "") {
            alert("La contraseña no puede estar vacía");
            return;
        }

        try {
            const formattedBirthdate = formatDate(editData.birthdate);
            const formData = new FormData();
            formData.append('id', editData.id);
            formData.append('name', editData.name);
            formData.append('surname', editData.surname);
            formData.append('lastname', editData.lastname);
            formData.append('email', editData.email);
            formData.append('phone', editData.phone);
            formData.append('urlMeet', editData.urlMeet);
            formData.append('password', editData.password);
            formData.append('birthdate', formattedBirthdate);
            formData.append('role', editData.role);
            formData.append('area', editData.area);
            formData.append('status', editData.status);
            formData.append('token', editData.token);

            if (ProfilePhoto) {
                formData.append('profilePhoto', ProfilePhoto);
            }

            console.log(ProfilePhoto);
            console.log('Role ID in FormData:', editData.role);
            console.log(editData);
            console.log("rol:", formData.get("role"));
            console.log([...formData.entries()]);

            const response = await AxiosClientWithoutInterceptors.put('/user/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.error) {
                setUser((user) => [response.data, ...user]);
                Alert.fire({
                    title: errorTitle,
                    text: errorMsj,
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleCloseEditModal();
                    }
                });
            }
            return response;
        } catch (error) {
            Alert.fire({
                title: "Registro realizada exitosamente",
                text: successMsj,
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
            }).then((result) => {
                if (result.isConfirmed) {
                    handleCloseEditModal();
                }
            });
        }

    };

    return (
        <>
            <Navbar bg="light" expand={expand} className="navbar">
                <Container fluid>
                    <Navbar.Brand href="/auth">
                        <img
                            src={Logo}
                            width="150"
                            height="60"
                            className="d-inline-block align-top"
                            alt="ARCON"
                        />
                    </Navbar.Brand>
                    <div className="botones">
                        
                        <Button
                            variant="outline-secondary"
                            href="/archivosEmpleado"
                            className="nav-button text-center text-white fw-bold border-0"
                        >
                            Gestión de archivos
                        </Button>
                    </div>

                    <Navbar.Toggle as={Button} aria-controls={`offcanvasNavbar-expand-${expand}`}>
                        <img
                            src={profileImage}
                            width="45"
                            height="45"
                            className="d-inline-block align-top"
                            alt="Toggle Button"
                        />
                    </Navbar.Toggle>

                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-${expand}`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                        placement="end"
                        className="Offcanvas"
                    >
                        <Offcanvas.Header closeButton className="offcanvas-header">

                        </Offcanvas.Header>
                        <Offcanvas.Body className="d-flex flex-column flex-grow-1 overflow-hidden">
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>

                                <span href="Sidebar" className="d-flex aling-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                    <img src={profileImage} className="imagen-estilo" />
                                    <div className="vertical"></div>
                                    <p className="fs-4 mb-5 ms-5 fw-normal">Empleado</p>
                                </span>
                            </Offcanvas.Title>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="flex-grow-2">
                                    <div className="NameUserNav">
                                        {user.usuario.name} {user.usuario.surname}{" "}
                                        {user.usuario.lastname}
                                    </div>
                                </div>
                                <span>
                                    <RiPencilFill className="edit-icon" onClick={handleEditProfile} style={{ color: 'white' }} />
                                </span>
                            </div>
                            <div className="DatosNav">
                                <span>{user.usuario.email}</span>
                                <br />
                                <span>{user.usuario.phone}</span>
                                <br />
                                <a href="/otra-vista">{user.usuario.urlMeet}</a>
                            </div>
                            <div className="d-flex align-items-center mt-auto">
                                <Button
                                    variant="primary"
                                    onClick={handleLogout}
                                    className="cerrarsesion"
                                    style={{ background: "none", border: "none", marginTop: "-10px" }}
                                >
                                    <FeatherIcon icon={"log-in"} className="text-center" />
                                    Cerrar sesión
                                </Button>
                            </div>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>

                </Container>
            </Navbar>
            <Modal
                show={showEditModal}
                onHide={handleCloseEditModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <div>
                                <img
                                    src={profileImage}
                                    width="150"
                                    height="150"
                                    className="d-inline-block align-top"
                                    alt="Profile Picture"
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
                            *es obligatorio cambiar este campo
                        </div>

                        <div className="col-md-6">
                            <form onSubmit={handleSubmitEdit}>
                                <div className="form-group">
                                    <label htmlFor="name">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        onChange={handleEditInputChange}
                                        value={editData.name}
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="surname">Apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="surname"
                                        onChange={handleEditInputChange}
                                        value={editData.surname}
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastname">Apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastname"
                                        onChange={handleEditInputChange}
                                        value={editData.lastname}
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Correo</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        onChange={handleEditInputChange}
                                        value={editData.email}
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        onChange={handleEditInputChange}
                                        value={editData.phone}
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="urlMeet">Enlace</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="urlMeet"
                                        onChange={handleEditInputChange}
                                        value={editData.urlMeet}
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                <label htmlFor="urlMeet">Contraseña </label>
                                <input
                                        type="text"
                                        className="form-control"
                                        id="password"
                                        onChange={handleEditInputChange}
                                        value={editData.password}
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', color: 'white' }}
                                    />
                                    *es obligatorio cambiar este campo
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmitEdit}>
                        Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );

}

export default NavLider;
