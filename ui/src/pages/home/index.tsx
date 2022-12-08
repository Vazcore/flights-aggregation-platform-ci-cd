import React, { useCallback, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { API } from "aws-amplify";

const Home = () => {
  const [routes, setRoutes] = useState([]);

  const searchFlights = useCallback(() => {
    API.get("routesapi", "/routes", {}).then((data) => setRoutes(data));
  }, [setRoutes]);

  return (<div>
    <div className="flight-search">
      <h4>Flight Status</h4>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Flight Origin</Form.Label>
        <Form.Control type="text" placeholder="Origin" name="origin" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Flight Destination</Form.Label>
        <Form.Control type="text" placeholder="Destination" name="destination" />
      </Form.Group>
      <Button variant="dark" onClick={searchFlights}>Search Flights</Button>
    </div>
  </div>);
};

export default Home;
