import React, { useState, useEffect } from "react";
import {
  Button,
  Accordion,
  Figure,
  Table,
  Modal,
  Col,
  Container,
  Row,
  Badge,
  Card,
} from "react-bootstrap";
import { FiSearch, FiEye, FiEyeOff } from "react-icons/fi";
import FeatherIcon from "feather-icons-react";
import admin from "../../../shared/CSS/admin.css";
import { mdiPlus, mdiAlphaX, mdiCheck, mdiPencil } from "@mdi/js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faTrashAlt,
  faEdit,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Agregaruser from "../../../assets/Agregaruser.png";
import Editar from "../../../assets/Editar.png";
import Eliminaruser from "../../../assets/Eliminaruser.png";
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from '../../../shared/plugins/axios';
import Alert, {
  confirmMsj,
  confirmTitle,
  errorMsj,
  errorTitle,
  successMsj,
  successTitle,
} from "../../../shared/plugins/alerts";
import { FilterComponent } from "../../../shared/components/FilterComponent";
import DataTable from "react-data-table-component";
import Loading from "./../../../shared/components/Loading";
import ContraseñasForm from "./components/ContraseñasForm";
import EdtContraseñas from "./components/EdtContraseñas";
import PasswordModal from "./components/PasswordModal";

const option = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};

// Sobrescribir los textos en español
if (navigator.language === "es") {
  option.rowsPerPageText = "Registros por página";
  option.rangeSeparatorText = "de";
}

const Contraseñas = () => {
  const [contraseñas, setContraseñas] = useState([]);
  const [selectedContraseñas, setSelectedContraseñas] = useState({});
  const [thisLoading, setThisLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState("");
  const [apartados, setApartados] = useState([]);
  const [apartadoPasswords, setApartadoPasswords] = useState({});
  const [selectedApartadoId, setSelectedApartadoId] = useState(null);
  const [openApartadoId, setOpenApartadoId] = useState(null);

  const handleShowPasswordModal = (password) => {
    setSelectedPassword(password);
    setPasswordModalOpen(true);
  };

  const handleModalClose = () => {
    setKeyword("");
    setPasswordModalOpen(false);
  };

  const handleSubmitKeyword = (keyword) => {
    if (keyword.trim() === "sandia") {
      Alert.fire({
        title: "Palabra clave correcta",
        text: "La palabra clave es correcta. Acceso permitido.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
      setShowPassword(!showPassword);
    } else {
      Alert.fire({
        title: "Palabra clave incorrecta",
        text: "La palabra clave es incorrecta. Acceso denegado.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    }
    setPasswordModalOpen(false);
  };

  useEffect(() => {
    getContraseñas();
    getApartados();
  }, []);

  const getContraseñas = async () => {
    try {
      setThisLoading(true);
      const data = await AxiosClientWithInterceptors({ url: "/site/" });
      if (!data.error) {
        setContraseñas(data.data);
        setThisLoading(false);
      }
    } catch (error) {
      setThisLoading(false);
    }
  };

  const getApartados = async () => {
    try {
      const data = await AxiosClientWithInterceptors({ url: "/apartado/" });
      if (!data.error) {
        setApartados(data.data);
        setThisLoading(false);
      }
    } catch (error) {
      setThisLoading(false);
    }
  };

  const fetchPasswordsForApartado = async (apartadoId) => {
    try {
      const response = await AxiosClientWithInterceptors({
        url: `/apartado/${apartadoId}/password/`,
      });
      if (!response.error) {
        setApartadoPasswords((prevPasswords) => ({
          ...prevPasswords,
          [apartadoId]: response.data,
        }));
        setThisLoading(false);
      }
    } catch (error) {
      setThisLoading(false);
    }
  };

  useEffect(() => {
    apartados.forEach((apartado) => {
      fetchPasswordsForApartado(apartado.id);
    });
  }, [apartados]);

  const filteredContraseñas = contraseñas.filter(
    (contraseña) =>
      contraseña.nameClient &&
      contraseña.nameClient.toLowerCase().includes(filterText.toLowerCase()) &&
      contraseña.status &&
      (!selectedApartadoId || contraseña.apartado?.id === selectedApartadoId)
  );

  // Cambio de status
  const enableOrDisable = async (row) => {
    Alert.fire({
      title: confirmTitle,
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
        row.status = !row.status;
        try {
          const response = await AxiosClientWithInterceptors({
            method: "PATCH",
            url: "/site/",
            data: JSON.stringify(row),
          });
          if (!response.error) {
            Alert.fire({
              title: successTitle,
              text: successMsj,
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Aceptar",
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
          });
        } finally {
          getContraseñas();
        }
      },
    });
  };

  // Buscador
  const headerComponent = React.useMemo(() => {
    return (
      <Container
        className="archivos-container"
        style={{ marginBottom: "10px" }}
      >
        <div className="d-flex" style={{ marginBottom: "40px" }}>
          <div style={{ width: "100%" }}>
            <div className="position-relative">
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Buscar contraseña"
                  style={{
                    borderRadius: "10px",
                    border: "2px solid #b0b6bf",
                    paddingLeft: "50px",
                  }}
                  className="form-control"
                />
                <div
                  className="position-absolute"
                  style={{
                    left: "10px",
                    top: "45%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <FiSearch size={20} color="#2596be" />
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "45%",
                  transform: "translateY(-50%)",
                }}
              >
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                  onClick={() => setIsOpen(true)}
                >
                  <FeatherIcon icon="plus" color="#2596be" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }, [filterText]);

  const handleAccordionToggle = async (apartadoId) => {
    if (openApartadoId === apartadoId) {
      setOpenApartadoId(null);
      setSelectedApartadoId(null);
    } else {
      setOpenApartadoId(apartadoId);
      setSelectedApartadoId(apartadoId);
      const passwordsForApartado = apartadoPasswords[apartadoId];
      if (passwordsForApartado) {
        setThisLoading(false);
      } else {
        setThisLoading(true);
        await fetchPasswordsForApartado(apartadoId);
      }
    }
  };

  // Columnas
  const columns = React.useMemo(
    () => [
      {
        name: "Nombre del cliente",
        selector: "name",
        sortable: true,
        cell: (row) => (
          <div className="text-center">
            <div className="justify-text">{row.nameClient}</div>
          </div>
        ),
        center: true,
      },
      {
        name: "Descripción",
        selector: "description",
        sortable: true,
        cell: (row) => (
          <div className="text-center">
            <div className="justify-text">{row.description}</div>
          </div>
        ),
        center: true,
      },
      {
        name: "Usuario sitio",
        selector: "site",
        sortable: true,
        cell: (row) => (
          <div className="text-center">
            <div className="justify-text">{row.userSite}</div>
          </div>
        ),
        center: true,
      },
      {
        name: "Contraseña",
        selector: "password",
        sortable: true,
        cell: (row) => (
          <div className="text-center">
            <div className="justify-text">
              {showPassword && selectedPassword === row.password ? (
                <div className="d-flex align-items-center justify-content-center">
                  <span>{row.password}</span>
                  <span
                    className="ml-2 eye-icon"
                    onClick={() => setShowPassword(false)}
                  >
                    <FiEyeOff />
                  </span>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center">
                  <span>******</span>
                  <span
                    className="ml-2 eye-icon"
                    onClick={() => handleShowPasswordModal(row.password)}
                  >
                    <FiEye />
                  </span>
                </div>
              )}
            </div>
          </div>
        ),
        center: true,
      },
      {
        name: "Ubicación",
        selector: "ubicacion",
        sortable: true,
        cell: (row) => (
          <div className="text-center">
            <div className="justify-text">{row.ubicacion}</div>
          </div>
        ),
        center: true,
      },
      {
        name: " ",
        cell: (row) => (
          <div className="text-center">
            <Button
              onClick={() => {
                setIsEditing(true);
                setSelectedContraseñas(row);
              }}
              variant="outline-secondary"
              className="btn-no-border"
              size="sm"
            >
              <FeatherIcon icon="edit-2" />
            </Button>
            <Button
              variant="outline-secondary"
              className="btn-no-border"
              size="sm"
              onClick={() => {
                enableOrDisable(row);
              }}
            >
              <FeatherIcon icon="trash-2" />
            </Button>
          </div>
        ),
        center: true,
      },
    ],
    [showPassword]
  );

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        color: "#1971AB",
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="accordion-container archivos-container">
      <div className="gestion-empleados-container">
        <h2 className="text-white">Gestión de contraseñas</h2>
      </div>
      {apartados.map((apartado) => (
        <Accordion
          key={apartado.id}
          className="accordion-container archivos-container"
          style={{ marginBottom: "-10px" }}
        >
          <Accordion.Item eventKey={apartado.id.toString()}>
            <Accordion.Header
              className="accordion-header"
              style={{ background: "none", color: "#fff" }}
              onClick={() => handleAccordionToggle(apartado.id)}
            >
              <b>{apartado.name}</b>
            </Accordion.Header>
            <Accordion.Body>
              {openApartadoId === apartado.id && (
                <Card className="border-0">
                  <Row>
                    <ContraseñasForm
                      isOpen={isOpen}
                      onclose={() => setIsOpen(false)}
                      setContraseñas={setContraseñas}
                      apartados={apartados}
                    />
                    <EdtContraseñas
                      isOpen={isEditing}
                      onclose={() => setIsEditing(false)}
                      setContraseñas={setContraseñas}
                      users={selectedContraseñas}
                      apartados={apartados}
                    />
                  </Row>
                  <Card.Body>
                    <DataTable
                      columns={columns}
                      customStyles={customStyles}
                      data={filteredContraseñas}
                      progressPending={thisLoading}
                      progressComponent={<Loading />}
                      noDataComponent={"Sin registros"}
                      pagination
                      paginationComponentOptions={option}
                      subHeader
                      subHeaderComponent={headerComponent}
                      persistTableHead
                      striped={true}
                      highlightOnHover={true}
                    />
                  </Card.Body>
                </Card>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={handleModalClose}
        onSubmitKeyword={handleSubmitKeyword}
        isPasswordVisible={showPassword}
        selectedPassword={selectedPassword}
      />
    </div>
  );
};

export default Contraseñas;