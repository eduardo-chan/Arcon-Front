import React, { useState, useEffect, useContext } from 'react';
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from '../../../shared/plugins/axios';
import { Table, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import FeatherIcon from "feather-icons-react";
import { AuthContext } from "../../auth/authContext"
import ArchivosFrom from "../Archivos/components/ArchivosForm";
import mimeDb from 'mime-db';

function Archivos() {
    const [drive, setArchivos] = useState({ data: [] });
    const [show, setShow] = React.useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const handleShow = () => setShow(true);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [editModalShow, setEditModalShow] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState(""); // Agrega esta línea al principio del componente



    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const [areaId, setAreaId] = useState({
        area: user.usuario.area.id,
    })

    let areaTexto;

    if (areaId.area === 1) {
        areaTexto = 'Diseño';
    } else if (areaId.area === 2) {
        areaTexto = 'Desarrollo';
    } else if (areaId.area === 3) {
        areaTexto = 'Marketing';
    } else if (areaId.area === 4) {
        areaTexto = 'Sistemas';
    }

    const handleEditModalClose = () => {
        setEditModalShow(false);
    };

    const [filteredArchivos, setFilteredArchivos] = useState([]);

    const handleSearch = () => {
        const trimmedSearchTerm = searchTerm.trim().toLowerCase();
        const results = drive.data.filter((archivo) =>
          archivo.name.toLowerCase().includes(trimmedSearchTerm)
        );
        setFilteredArchivos(results);
      };
      
      useEffect(() => {
        const filteredByAreaAndUser = drive.data.filter((archivo) => {
          const matchesArea = archivo.area.id === user.usuario.area.id;
          const trimmedSearchTerm = searchTerm.trim().toLowerCase();
      
          return matchesArea && archivo.name.toLowerCase().includes(trimmedSearchTerm);
        });
      
        setFilteredArchivos(filteredByAreaAndUser);
      }, [drive, user, searchTerm]);


    const SearchFiltred = drive.data.filter((archivo) => {
        const searchTerm = searchQuery.trim().toLowerCase();
        return archivo.name.toLowerCase().includes(searchTerm);
    });


    const getMimeType = (archivoNombre) => {
        const extension = archivoNombre.split('.').pop();
        const mimeEntry = mimeDb[extension];
        return mimeEntry ? mimeEntry.mime : 'application/octet-stream';
    };

    useEffect(() => {
        AxiosClientWithoutInterceptors.get('/archive/')
            .then((response) => {
                console.log('Datos obtenidos:', response.data);
                setArchivos(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener la lista de archivos:', error);
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
    useEffect(() => {
        console.log('Estado de "drive":', drive);
    }, [drive]);

    return (
        <>
            <div className="container">
                <br />
                <div className="consulta">
                    <h2>Gestion de archivos</h2>
                </div>
                <br />
                <br />

                <div className="Area">
                    <h5 className="textoarea">{areaTexto}</h5>
                </div>

                <div className="buscararchivos">
                    <Form className="password-form">
                        <div className="password-input">
                            <InputGroup className="mb-3 input ">
                                <Button
                                    variant="outline-primary"
                                    className="circulo"
                                >
                                    <FeatherIcon icon="search" />
                                </Button>
                                <Form.Control
                                    placeholder="Buscar archivo"
                                    aria-label="Buscar archivo"
                                    aria-describedby="basic-addon2"
                                    className="circulo"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} // Cambia 'searchQuery' a 'setSearchTerm'
                                />

                                <Button
                                    variant="outline-primary"
                                    id="button-addon2"
                                    className="circulo"
                                    onClick={() => {
                                        setIsOpen(true);
                                    }}
                                >
                                    <FeatherIcon icon="plus" />
                                </Button>
                            </InputGroup>
                            <ArchivosFrom
                                isOpen={isOpen}
                                onclose={() => setIsOpen(false)}
                                setUsuarios={setArchivos}
                            />
                        </div>
                    </Form>
                    <br />

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
                            {filteredArchivos.map((archivo) => (
                                <tr key={archivo.id}>
                                    <td>{archivo.name}</td>
                                    <td>{archivo.description}</td>
                                    <td><a href={archivo.drive} target="_blank">{archivo.drive}</a></td>

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
                                            <FontAwesomeIcon icon={faDownload} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div >
        </>
    );
};

export default Archivos;
