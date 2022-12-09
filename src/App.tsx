import React from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import config from "./aws-exports";
import { Grid, Authenticator } from "@aws-amplify/ui-react"; 

import "@aws-amplify/ui-react/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./componenents/Header";
import Container from "react-bootstrap/Container";
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/home";
import User from "./pages/user";
import AdminPage from "./pages/admin";

Amplify.configure(config);

function App() {
  return (
    <Authenticator.Provider>
      <Grid
        columnGap="0.5rem"
        rowGap="0.5rem"
        templateColumns="1fr"
        templateRows="1fr 1"
      >
        <BrowserRouter>
          <Header />
          <Container>
            <Routes>
              <Route index path="/" element={<Home />}></Route>
              <Route path="/user" element={<User />}></Route>
              <Route path="/admin" element={<AdminPage />}></Route>
            </Routes>
          </Container> 
        </BrowserRouter>
        
        {/* <Container>
          <div>ChatBot</div>
        </Container> */}
      </Grid>
    </Authenticator.Provider>
  );
}

export default App;
