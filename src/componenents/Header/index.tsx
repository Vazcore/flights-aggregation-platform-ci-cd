import React, { useCallback } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuthenticator } from "@aws-amplify/ui-react"; 
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../../auth";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut, authStatus } = useAuthenticator();

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
      <Link to="/" className="nav-link-app"><Navbar.Brand>FunWithFlights</Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="flex-right">
          {isAuth(authStatus) && <Nav className="me-auto nav-link-app app m-right-40">
            <Link to="/user">Members</Link>
          </Nav>}
          <Nav className="me-auto">
            {user && (<Nav.Link onClick={onSignOut}>Logout ({user.username})</Nav.Link>)}
            {!user && <Link className="nav-link-app" to="/user">Login</Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
