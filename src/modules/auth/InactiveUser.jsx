import React, { useContext } from 'react';
import { Col, Row, Figure, Button } from "react-bootstrap";
import { AuthContext } from "./../../modules/auth/authContext";
import { useNavigate } from "react-router-dom";
import admin from "../../shared/CSS/admin.css";
import RobotC from "../../assets/RobotC.png";

const InactiveUser = () => {
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  };

  return (
    <div className="fullscreen-bg">
      <div className="center gradient-custom-4 d-flex justify-content-center align-items-center text-white">
        <div className="content">
          <Row className="center">
            <Col>
              <Figure className="mx-5">
                <Figure.Image width={350} height={350} alt="ARCON" src={RobotC} />
              </Figure>
            </Col>
          </Row>
          <Row className="center text-center">
            <h1>
              {user.usuario.name} {user.usuario.surname} {user.usuario.lastname}
            </h1>
            <p className="textinac">¡Tu cuenta se encuentra inactiva!</p>
            <div className="text-center pt-1 pb-1">
              <Button variant="primary" onClick={handleLogout}>
                Volver
              </Button>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default InactiveUser;