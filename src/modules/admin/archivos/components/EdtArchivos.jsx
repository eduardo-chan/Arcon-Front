import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import * as yup from "yup";
import { pdfjs } from "react-pdf"; // Importa pdfjs aquí
import { Document, Page } from "react-pdf"; // Importa Document y Page desde react-pdf
import { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors } from "../../../../shared/plugins/axios";
import Alert from 'sweetalert2';

// Actualizar
function EdtArchivos({ show, onClose, archivoSeleccionado }) {
  const confirmMsj = "Mensaje de confirmación";
  const successMsj = "Mensaje de éxito";
  const errorTitle = "Título del error";
  const errorMsj = "Mensaje de error";
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const fileInputRef = useRef(null);


  useEffect(() => {
    if (archivoSeleccionado) {
      setName(archivoSeleccionado.name);
      setDescription(archivoSeleccionado.description);
      setDrive(archivoSeleccionado.drive);
      setArchivo(archivoSeleccionado.archivo);
    }
  }, [archivoSeleccionado]);

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

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [FechaCarga, setFechaCarga] = useState("");
  const [drive, setDrive] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [status, setStatus] = useState(true);
  const [selectedArea, setSelectedArea] = useState("");
  const [areasList, setAreasList] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      drive: "",
      archivo: null,
      status: true,
    }
  });

  useEffect(() => {
  }, [name, description, FechaCarga, drive, archivo, status]);

  const handleGuardarClick = async (event) => {
    event.preventDefault();

    if (!archivoSeleccionado) {
      console.error("No se ha seleccionado un archivo para editar.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("FechaCarga", new Date().toLocaleDateString());
    formData.append("drive", drive);
    formData.append("status", status);
    formData.append("archivo", archivo);
    formData.append("area", selectedArea);

    try {
      const response = await AxiosClientWithoutInterceptors.post(`/archive/?id=${archivoSeleccionado.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Lógica para manejar la respuesta exitosa, si es necesario
      console.log("Respuesta exitosa:", response);
      if (!response.error) {
        // Actualizar la lista de archivos u otra lógica necesaria
        Alert.fire({
          title: "Edición realizada exitosamente",
          text: "El archivo ha sido editado correctamente.",
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
      console.error("Error al editar el archivo:", error);
      // Lógica para manejar el error, si es necesario
    }
    formik.resetForm();
  };

  useEffect(() => {
  }, [name, description, FechaCarga, drive, archivo, status]);

  useEffect(() => {
    AxiosClientWithInterceptors.get("/area/")
      .then((response) => {
        console.log("Áreas obtenidas:", response.data); // Verifica aquí si obtienes los datos correctamente
        setAreasList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener la lista de áreas:", error);
      });
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered
      backdrop="static" >
      <Modal.Body className="pink-modal">
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
            <div className="col-md-6" >
              <Modal.Title>| Datos del archivo</Modal.Title>
              <br />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre: </Form.Label>
                  <Form.Control
                    type="text"
                    autoFocus
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ border: "2px solid #151F30", borderRadius: '20px', background: 'transparent', width: '350px', color: 'white' }}
                  />

                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de carga: </Form.Label>
                  <div className="fecha"
                    name="FechaCarga"
                    value={FechaCarga}
                    style={{ border: "2px solid #151F30", borderRadius: '20px', background: 'transparent', width: '350px', color: 'white' }}>
                    {new Date().toLocaleDateString()}
                  </div>

                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Drive:</Form.Label>
                  <Form.Control
                    type="text"
                    name="drive"
                    value={drive}
                    onChange={(e) => setDrive(e.target.value)}
                    autoFocus
                    style={{
                      border: "2px solid #1971AB",
                      borderRadius: "20px",
                      background: "transparent",
                      color: "white",
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Área:</Form.Label>
                  <Form.Select
                    name="area"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    style={{
                      border: "2px solid #1971AB",
                      borderRadius: "20px",
                      background: "transparent",
                      color: "white",
                    }}
                  >
                    <option value=""
                      style={{ backgroundColor: "#343c44", borderRadius: "20px" }}>Seleccionar Área</option>
                    {areasList.map((area) => (
                      <option key={area.id} value={area.id}
                        style={{ backgroundColor: "#343c44", borderRadius: "20px" }}>
                        {area.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="Textarea">
                  <Form.Label>Descripción: </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ background: 'transparent', border: "2px solid #151F30", color: 'white' }}
                    rows={3}
                  />
                </Form.Group>
                <label>
                  Status:
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                  />
                </label>
                <Form.Group className="mb-3">
                  <Row>
                    <Col className="text-end">
                      <Button variant="light" className="me-2" onClick={handleClose}>
                        Cancelar
                      </Button>
                      <Button variant="primary" onClick={handleGuardarClick}>
                        Guarda
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}


export default EdtArchivos;