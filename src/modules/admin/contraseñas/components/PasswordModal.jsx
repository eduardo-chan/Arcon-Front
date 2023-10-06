import React, { useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordModal = ({
  isOpen,
  onClose,
  onSubmitKeyword,
  isPasswordVisible,
  selectedPassword,
}) => {
  const [keyword, setKeyword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onSubmitKeyword(keyword);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Modal size="md" centered backdrop="static" show={isOpen} onHide={onClose}>
      <Modal.Body className="blue-modal">
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ marginBottom: "20px" }}
        >
          | Clave
        </Modal.Title>
        <Form.Group className="mb-3">
          <Form.Label>Clave de acceso:</Form.Label>
          <div className="password-input-wrapper">
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="custom-input"
              style={{
                border: "2px solid #1971AB",
                borderRadius: "20px",
                background: "transparent",
                color: "white",
                paddingRight: "40px", 
              }}
            />
            <span className="eye-icon" onClick={handleTogglePasswordVisibility}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Row>
            <Col className="text-center">
              <Button className="me-2" variant="light" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" onClick={handleSubmit}>
                Acceder
              </Button>
            </Col>
          </Row>
        </Form.Group>
        {isPasswordVisible && (
          <div className="password-visibility-message">
            <p>Contraseña desbloqueada: {selectedPassword}</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PasswordModal;
