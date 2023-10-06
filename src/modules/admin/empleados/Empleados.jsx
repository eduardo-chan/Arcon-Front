import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  InputGroup,
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
import { FiSearch } from "react-icons/fi";
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
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from "../../../shared/plugins/axios";
import Alert, {
  confirmMsj,
  confirmTitle,
  errorMsj,
  errorTitle,
  successMsj,
  successTitle,
} from "../../../shared/plugins/alerts";
import { FilterComponent } from "../../../shared/components/FilterComponent";
import EmpleadosForm from "../empleados/components/EmpleadosForm";
import EdtEmpleado from "./components/EdtEmpleado";
import DataTable from "react-data-table-component";
import Loading from "./../../../shared/components/Loading";

const option = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};

// Sobrescribir los textos en español
if (navigator.language === "es") {
  option.rwsPerPageText = "Registros por página";
  option.rangeSeparatorText = "de";
}

const Empleados = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState({});
  const [thisLoading, setThisLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  //filtrador para el buscador
  const filteredUsuarios = usuarios.filter(
    (user) =>
      user.name &&
      user.name.toLowerCase().includes(filterText.toLocaleLowerCase())
  );

  //obtiene info usuarios
  const getUsuarios = async () => {
    try {
      setThisLoading(true);
      const data = await AxiosClientWithInterceptors({ url: "/user/" });
      if (!data.error) {
        setUsuarios(data.data);
        setThisLoading(false);
      }
      console.log("data", data);
    } catch (error) {
      setThisLoading(false);
    }
  };
  useEffect(() => {
    getUsuarios();
  }, []);

  //Cambio de status
  const enableOrDisable = async (userId, newStatus) => {
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
        try {
          const response = await AxiosClientWithInterceptors({
            method: "PATCH",
            url: `/user/${userId}/status`,
            data: { status: newStatus }, // Enviar solo el nuevo estado
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
          getUsuarios();
        }
      },
    });
  };



  useEffect(() => {
    document.title = "ARCON";
  }, []);


  //Buscador
  const headerComponent = React.useMemo(() => {
    return (
      <Container
        className=" archivos-container"
        style={{ marginBottom: "10px" }}
      >
        <div className="d-flex" style={{ marginBottom: "40px" }}>
          <div
            className="input-group"
            style={{ width: "350px", marginRight: "10px" }}
          >
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Buscar usuarios"
              style={{
                borderRadius: "50px",
                border: "2px solid #1971AB",
                paddingRight: "40px",
              }}
              className="form-control"
            />
            <div
              className="input-group-append"
              style={{ position: "relative" }}
            >
              <span
                className="input-group-text"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  position: "absolute",
                  right: "0",
                  top: "0",
                  bottom: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiSearch size={20} color="#2596be" />
              </span>
            </div>
          </div>
          <Button
            style={{ backgroundColor: "#2596be" }}
            onClick={() => setIsOpen(true)}
          >
            <img
              src={Agregaruser}
              width="25"
              height="25"
              className="d-inline-block align-top"
              alt="Toggle Button"
            />
          </Button>
        </div>
      </Container>
    );
  }, [filterText]);

  //Columnas
  const columns = React.useMemo(() => [
    {
      name: "Nombre (s)",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="text-center">{row.name}</div>
      ),
    },
    {
      name: "Apellidos",
      selector: (row) => `${row.surname} ${row.lastname}`,
      sortable: true,
      cell: (row) => (
        <div className="text-center">
          {row.surname} {row.lastname}
        </div>
      ),
    },
    {
      name: "Fecha de nacimiento",
      selector: "date",
      sortable: true,
      cell: (row) => (
        <div className="text-center">
          {new Date(row.birthdate).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      name: "Correo ",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <div className="text-center">{row.email}</div>,
    },

    {
      name: "Teléfono",
      selector: (row) => row.phone,
      sortable: true,
      cell: (row) => <div className="text-center">{row.phone}</div>,
    },
    {
      name: "Rol",
      selector: (row) => row.rol,
      sortable: true,
      cell: (row) => <div className="text-center">{row.role.name}</div>,
    },
    {
      name: "Estado",
      sortable: true,
      cell: (row) =>
        row.status ? (
          <Badge bg="success">Activo</Badge>
        ) : (
          <Badge bg="danger">Inactivo</Badge>
        ),
    },
    {
      name: " ",
      cell: (row) => (
        <div className="text-center">
          <Button
            onClick={() => {
              setIsEditing(true);
              setSelectedUsuarios(row);
            }}
            style={{ backgroundColor: "#2596be", marginRight: "10px", padding: "4px", width: "30px", height: "30px" }}
          >
            <img
              src={Editar}
              width="18"
              height="18"
              className="d-inline-block align-top"
              alt="Toggle Button"
            />
          </Button>
          <Button
            style={{
              backgroundColor: "#2596be",
              padding: "4px",
              width: "30px",
              height: "30px",
            }}
            onClick={() => {
              enableOrDisable(row.id, !row.status); // Pasar el ID y el nuevo estado
            }}
          >
            <img
              src={Eliminaruser}
              width="18"
              height="18"
              className="d-inline-block align-top"
              alt="Toggle Button"
            />
          </Button>

        </div>
      ),
    },
  ],
    []
  );

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        color: "#1971AB",
        fontSize: '14px',
      },
    },
  };

  return (
    <Card className="accordion-container archivos-container border-0">
      <Row>
        <Col className="gestion-empleados-container">
          {" "}
          <h2 className="text-white">Gestión de empleados</h2>{" "}
        </Col>
        <EmpleadosForm
          isOpen={isOpen}
          onclose={() => setIsOpen(false)}
          setUsuarios={setUsuarios}
        />
        <EdtEmpleado
          isOpen={isEditing}
          onclose={() => setIsEditing(false)}
          setUsuarios={setUsuarios}
          users={selectedUsuarios}
        />
      </Row>
      <Card.Body>
        <DataTable
          columns={columns}
          customStyles={customStyles}
          data={filteredUsuarios}
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
  );
};
export default Empleados;