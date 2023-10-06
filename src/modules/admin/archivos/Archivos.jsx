import React, { useState, useEffect, useCallback } from 'react';
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from "../../../shared/plugins/axios";
import { Table, Button, Form, InputGroup, Accordion, Card, Row, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import FeatherIcon from "feather-icons-react";
import ArchivosForm from "../archivos/components/ArchivosForm";
import EdtArchivos from "../archivos/components/EdtArchivos";
import mimeDb from 'mime-db';

const Archivos = () => {
    const [archivos, setArchivos] = useState({ data: [] });
    const [isOpen, setIsOpen] = useState({}); // Un objeto para rastrear qué acordeón está abierto
    const [searchQuery, setSearchQuery] = useState('');
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [editModalShow, setEditModalShow] = useState(false);
    const [areasId, setAreasId] = useState({ data: [] });

    const handleShow = (areaId) => {
        setIsOpen(prevState => ({ ...prevState, [areaId]: true }));
    };

    const handleEditClick = (archivo) => {
        setArchivoSeleccionado(archivo);
        setEditModalShow(true);
    };


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    
    const handleEditModalClose = () => {
        setEditModalShow(false);
    };

    const getMimeType = (archivoNombre) => {
        const extension = archivoNombre.split('.').pop();
        const mimeEntry = mimeDb[extension];
        return mimeEntry ? mimeEntry.mime : 'application/octet-stream';
    };

    useEffect(() => {
        AxiosClientWithoutInterceptors.get('/archive/')
            .then((response) => {
                setArchivos(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener la lista de archivos:', error);
            });
    }, []);

    useEffect(() => {
        AxiosClientWithoutInterceptors.get("/area/")
            .then((response) => {
                console.log("Áreas obtenidas:", response.data);
                setAreasId(response.data);  // Cambio de setAreasIdList a setAreasId
            })
            .catch((error) => {
                console.error("Error al obtener la lista de áreas:", error);
            });
    }, []);


    const descargarArchivo = (archivoId, archivoNombre) => {
        AxiosClientWithoutInterceptors.get(`/archive/${archivoId}`, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data]);
                const url = window.URL.createObjectURL(blob);

                // Obtener el tipo de contenido del archivo
                const mimeType = getMimeType(archivoNombre);

                // Crear un enlace temporal para descargar el archivo
                const a = document.createElement('a');
                a.href = url;

                // Establecer el tipo de contenido en el enlace temporal
                a.type = mimeType;

                // Agregar el atributo 'download' con el nombre del archivo
                a.setAttribute('download', archivoNombre);

                // Agregar el enlace temporal al documento y hacer clic en él
                document.body.appendChild(a);
                a.click();

                // Remover el enlace temporal del documento
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error al descargar el archivo:', error);
            });
    };

    const eliminarArchivo = (id) => {
        AxiosClientWithoutInterceptors.delete(`/archive/?id=${id}`)
            .then((response) => {
                console.log('Archivo eliminado:', response.data);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error al eliminar el archivo:', error);
            });
    };
    
    const archivosByArea = {};
    archivos.data.forEach((archivo) => {
        const { area } = archivo;
        if (!archivosByArea[area.id]) {
            archivosByArea[area.id] = { area, files: [] };
        }
        if (archivosByArea[area.id] && archivo) {
            archivosByArea[area.id].files.push(archivo);
        }
    });

    const handleClose = useCallback((areaId) => {
        setIsOpen((prevState) => ({ ...prevState, [areaId]: false }));
    }, []);



    return (
        <>
            <div className="accordion-container archivos-container">
                <div className="gestion-empleados-container">
                    <h2 className="text-white">Gestión de archivos</h2>
                </div>
                {areasId.data.map((area) => (
                    <Accordion key={area.id} className="accordion-container archivos-container" style={{ marginBottom: "-10px" }}>
                        <Accordion.Item eventKey={area.id.toString()}>
                            <Accordion.Header className="accordion-header">
                                <h5 className="textoarea">{area.name}</h5>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Card className="border-0">
                                    <Card.Body>
                                        <Container className="archivos-container" style={{ marginBottom: "10px" }}>
                                            <Form className="password-form">
                                                <InputGroup className="mb-3 input">
                                                    <Button
                                                        variant="outline-primary"
                                                    >
                                                        <FeatherIcon icon="search" />
                                                    </Button>
                                                    <Form.Control
                                                        placeholder="Buscar archivo"
                                                        aria-label="Buscar archivo"
                                                        aria-describedby="basic-addon2"
                                                        className="circulo"
                                                        value={searchQuery}
                                                        onChange={handleSearchChange}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <Button
                                                        variant="outline-primary"
                                                        id="button-addon2"
                                                        onClick={() => handleShow(area.id)}
                                                    >
                                                        <FeatherIcon icon="plus" />
                                                    </Button>
                                                </InputGroup>
                                                <ArchivosForm
                                                    isOpen={isOpen[area.id]}
                                                    onClose={() => handleClose(area.id)}
                                                    setArchivos={setArchivos}
                                                />
                                            </Form>
                                        </Container>
                                        <Table striped bordered>
                                            <thead>
                                                <tr className="columns">
                                                    <th className="border-0">Nombre</th>
                                                    <th className="border-0">Descripción</th>
                                                    <th className="border-0">Drive</th>
                                                    <th className="border-0">Fecha de carga</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {archivosByArea[area.id] &&
                                                    archivosByArea[area.id].files
                                                    .filter(archivo =>
                                                        !archivo.isDeleted && archivo.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                    )
                                                        .map((archivo) => (
                                                            <tr key={archivo.id}>
                                                                <td>{archivo.name}</td>
                                                                <td>{archivo.description}</td>
                                                                <td><a href={archivo.drive} target="_blank" rel="noopener noreferrer">{archivo.drive}</a></td>
                                                                <td>
                                                                    {archivo.fechaCarga ? (
                                                                        new Date(archivo.fechaCarga).toLocaleDateString('es-ES', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: '2-digit',
                                                                        })
                                                                    ) : (
                                                                        <span>Fecha inválida</span>
                                                                    )}
                                                                </td>
                                                                <td className="text-center align-middle">
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        className="btn-no-border"
                                                                        size="sm"
                                                                        onClick={() => descargarArchivo(archivo.id, archivo.name)}
                                                                    >
                                                                        <FeatherIcon icon="download" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        className="btn-no-border"
                                                                        size="sm"
                                                                        onClick={() => handleEditClick(archivo)}
                                                                    >
                                                                        <FeatherIcon icon="edit-2" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        className="btn-no-border"
                                                                        size="sm"
                                                                        onClick={() => eliminarArchivo(archivo.id)}
                                                                    >
                                                                        <FeatherIcon icon="trash-2" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                            </tbody>
                                        </Table>
                                        <EdtArchivos show={editModalShow} onClose={handleEditModalClose} archivoSeleccionado={archivoSeleccionado} />
                                    </Card.Body>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                ))}
            </div>
        </>
    );
};

export default Archivos;