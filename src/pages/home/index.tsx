import React, { useCallback, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { API } from "aws-amplify";
import RoutesList from "./routes-list";
import Loader from "../../componenents/Spinner";

const Home = () => {
  const LIMIT = 100;
  const [routes, setRoutes] = useState([]);
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(0);

  const searchFlights = useCallback(() => {
    setLoading(true);
    setRoutes([]);
    setFrom(0);
    API.get("routescicdapi", `/routes?origin=${origin}&dest=${dest}`, {})
      .then((data) => {
        setLoading(false);
        setRoutes(data);
      });
  }, [setRoutes, origin, dest, setLoading, setFrom]);

  const loadAllRoutes = useCallback((from = 0, to = LIMIT) => {
    setLoading(true);
    API.get("routescicdapi", `/routes?from=${from}&to=${to}`, {})
    .then((data) => {
      setLoading(false);
      if (from > 0) {
        setRoutes(routes.concat(data));
      } else {
        setRoutes(data);
      }
    });
    setFrom(from + LIMIT);
  }, [setRoutes, setFrom, routes]);

  return (<div>
    <div className="flight-search">
      <h4>Flight Status</h4>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Flight Origin</Form.Label>
        <Form.Control type="text" placeholder="Origin" name="origin"
          onChange={(event) => setOrigin(event.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Flight Destination</Form.Label>
        <Form.Control type="text" placeholder="Destination" name="destination"
          onChange={(event) => setDest(event.target.value)} />
      </Form.Group>
      <div className="flex h-between">
        <Button variant="dark"
          onClick={searchFlights}
          disabled={!origin.length || !dest.length}>
          Search Flights
        </Button>
        <Button variant="dark"
          onClick={() => loadAllRoutes()}>
          Load ALL
        </Button>
      </div>
    </div>

    {routes.length > 0 && <RoutesList routes={routes} />}
    {!loading && from > 0 &&
      <Button variant="dark" onClick={() => loadAllRoutes(from, from + LIMIT)}>Load More</Button>}
    {loading && <Loader />}
  </div>);
};

export default Home;
