import React from "react";
import "../../shared/custom-styles.css";
import "../Liderdearea/Nav.css";
import robot from "../../assets/RobotC.png";
import {
  CardGroup,
  Card,
} from "react-bootstrap";

function Bienvenida() {
  return (
    <div
      className="gradient-custom-2"
      style={{
        background: 'linear-gradient(to right, #151F30, #444C59)',
      }}
    >
      <div className="d-flex justify-content-center align-items-center text-white" style={{ height: '100%' }}>
        <CardGroup>
          <Card style={{ background: "none", border: "none" }}>
            <Card.Body className="card-body">
              <Card.Text className="Title text-center mb-5">
                ¡Bienvenid@!
              </Card.Text>
              <Card.Text className="text text-center">
              ❝ El único modo de hacer un gran trabajo es amar lo que haces. ❞ 
              </Card.Text>
            </Card.Body>
          </Card>
          <Card style={{ background: "none", border: "none" }}>
            <Card.Img
              width={520}
              height={520}
              variant="top"
              src={robot}
              alt="Imagen de robot"
            />
          </Card>
        </CardGroup>
      </div>
    </div>
  );
}

export default Bienvenida;
