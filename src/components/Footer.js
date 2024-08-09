import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Footer = () => {
  return (
    <footer className="footer py-4 bg-dark text-white">
      <Container>
        <Row className="align-items-center">
          <Col lg="4" className="text-lg-start">
            Copyright &copy; Radio Songs International 2024
          </Col>
          <Col lg="4" className="my-3 my-lg-0 text-center">
            <a className="btn btn-light btn-social mx-2" href="#!" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a className="btn btn-light btn-social mx-2" href="#!" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a className="btn btn-light btn-social mx-2" href="#!" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </Col>
          <Col lg="4" className="text-lg-end text-center">
            Creado por Andres Ragua Dev
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
