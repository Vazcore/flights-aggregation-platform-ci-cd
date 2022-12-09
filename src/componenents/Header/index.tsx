import React, { useCallback } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuthenticator } from "@aws-amplify/ui-react"; 
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthenticator();

  const onSignOut = useCallback((event: React.MouseEvent) => {
    signOut(event);
    
    setTimeout(() => {
      navigate("/");
      document.location.reload();
    }, 1000);
  }, [signOut, navigate]);

  return (
    <Navbar bg="dark" expand="lg" className="app nav-bar-app">
      <Container>
        <Navbar.Brand href="/">FunWithFlights</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="flex-right">
          <Nav className="me-auto ">
            {user && (<Nav.Link onClick={onSignOut}>Logout ({user.username})</Nav.Link>)}
            {!user && <Link to="/user">Login</Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
