import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button, CardGroup, Card, Offcanvas, Modal } from "react-bootstrap";
import styles from "../../shared/CSS/custom-styles.css";
import robot from "../../assets/robot.png";
import Logoh from "../../assets/logoh.png";
import Usuario from "../../assets/Usuario.png";
import FeatherIcon from "feather-icons-react";
import { RiPencilFill } from "react-icons/ri";

function Welcome() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = () => {
    // Lógica para cerrar sesión
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    document.title = "ARCON";
  }, []);

  return (
    <div className="gradient-custom-2">
      <Container>
        <div className="d-flex justify-content-center align-items-center text-white">
          <CardGroup>
            <Card className="bg-transparent border-0">
              <Card.Body className="card-body">
                <Card.Text className="Title text-center mb-5">
                  ¡Bienvenid@!
                </Card.Text>
                <Card.Text className="text text-center">
                  ❝ La tecnología es importante, pero lo único que realmente
                  importa es qué hacemos con ella. ❞
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className="bg-transparent border-0">
              <Card.Img
                width={100}
                height={500}
                variant="top"
                src={robot}
                alt="Imagen de robot"
              />
            </Card>
          </CardGroup>
        </div>
      </Container>
    </div>
  );
}

export default Welcome;
