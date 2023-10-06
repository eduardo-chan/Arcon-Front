import React, { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import { Button, Form, Modal } from "react-bootstrap";
import * as yup from "yup";
import { pdfjs } from "react-pdf";
import { AuthContext } from "../../../auth/authContext"
import { Document, Page } from "react-pdf";
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from '../../../../shared/plugins/axios';
import Alert from 'sweetalert2';
import Alerts, {
    confirmMsj,
    confirmTitle,
    errorMsj,
    errorTitle,
    successMsj,
    successTitle,
} from "../../../../shared/plugins/alerts";

const validationSchema = yup.object().shape({
    name: yup.string().required("Nombre es obligatorio"),
    description: yup.string().required("Descripción es obligatoria"),
    drive: yup.string().required("Drive es obligatorio"),
    archivo: yup.mixed().required("Archivo es obligatorio"),
});

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const ArchivosForm = ({ isOpen, onclose, setArchivos }) => {
    const confirmMsj = "Mensaje de confirmación";
    const successMsj = "Mensaje de éxito";
    const errorTitle = "Título del error";
    const errorMsj = "Mensaje de error";
    const { user } = useContext(AuthContext);
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setTotalPages(numPages);
    };

    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);


        if (file.type === "application/pdf") {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPdfBlob(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        } else {
            setPdfBlob(null);
        }
    };
    const [areaId, setAreaId] = useState({
        area: user.usuario.area.id,
    })

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [FechaCarga, setFechaCarga] = useState("");
    const [drive, setDrive] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [status, setStatus] = useState(true);
    const [Area, setArea] = useState(user.usuario.area.id);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!archivo) {
            console.error("El archivo no ha sido seleccionado.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("FechaCarga", new Date().toLocaleDateString());
        formData.append("drive", drive);
        formData.append("status", status);
        formData.append("archivo", archivo, archivo.name);
        formData.append("Area", Area);

        console.log("formData:", formData);
        console.log("Nombre:", formData.get("name"));
        console.log("Descripción:", formData.get("description"));
        console.log("Drive:", formData.get("drive"));
        console.log("Status:", formData.get("status"));
        console.log("Archivo:", formData.get("archivo"));
        console.log("Área ID:", formData.get("Area"));


        try {
            console.log("formData:", formData);
            const response = await AxiosClientWithoutInterceptors.post("/archive/", formData, {
                headers: { "Content-Type": "multipart/formData" }
            })

            // Lógica para manejar la respuesta exitosa, si es necesario
            console.log("Respuesta exitosa:", response);
            if (!response.error) {
                setArchivos((archivos) => [response.data, ...archivos]);
                Alerts.fire({
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
            return response;
        } catch (error) {
            Alerts.fire({
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
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            drive: "",
            archivo: null,
            status: true,
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
    }, [name, description, FechaCarga, drive, archivo, status]);



    const handleClose = () => {
        onclose();
    };

    return (
        <Modal show={isOpen} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton variant="white">
                <Modal.Title>Subir</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid">
                    <div className="row" >
                        <div className="col-md-6" style={{ border: '5px dotted gray', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            {pdfBlob ? (
                                // Si el archivo seleccionado es un PDF, mostrarlo usando react-pdf
                                <div style={{ width: '300px', height: '300px', overflow: 'hidden' }}>
                                    <Document file={pdfBlob} onLoadSuccess={onDocumentLoadSuccess}>
                                        {/* Mostrar solo la primera página del PDF */}
                                        <Page pageNumber={1} width={300} />
                                    </Document>
                                </div>
                            ) : (
                                // Si el archivo seleccionado no es un PDF, mostrar una imagen o mensaje
                                selectedFile ? (
                                    selectedFile.type.startsWith("image/") ? (
                                        <img src={URL.createObjectURL(selectedFile)} alt="Vista previa" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                                    ) : (
                                        <div>No se puede mostrar la vista previa de este tipo de archivo</div>
                                    )
                                ) : (
                                    <div>No se ha seleccionado ningún archivo</div>
                                )
                            )}
                            <div style={{ marginTop: '20px' }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Archivo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => {
                                            handleFileChange(e);
                                            setArchivo(e.target.files[0]);
                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        autoFocus
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', width: '350px', color: 'white' }}
                                    />

                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de carga</Form.Label>
                                    <div className="fecha"
                                        name="FechaCarga"
                                        value={FechaCarga}
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', width: '350px', color: 'white' }}>
                                        {new Date().toLocaleDateString()}
                                    </div>

                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Drive</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="drive"
                                        value={drive}
                                        onChange={(e) => setDrive(e.target.value)}
                                        autoFocus
                                        style={{ border: '2px solid blue', borderRadius: '20px', background: 'transparent', width: '350px', color: 'white' }}
                                    />

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="Textarea">
                                    <Form.Label>Descripcion</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ background: 'transparent', border: '2px solid blue', color: 'white' }}
                                        rows={3}
                                    />
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Guardar archivo
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default ArchivosForm;