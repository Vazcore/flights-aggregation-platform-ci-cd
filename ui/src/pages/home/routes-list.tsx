import React from "react";
import { Table } from "react-bootstrap";
import { FlightRoute } from "../../models/flight-route";


interface IRoutesListProps {
  routes?: Array<FlightRoute>;
}
const RoutesList = ({
  routes = [],
}: IRoutesListProps) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Airline</th>
          <th>CodeShare</th>
          <th>Source Airport</th>
          <th>Destination Airport</th>
          <th># stops</th>
          <th>Equipment</th>
        </tr>
      </thead>
      <tbody>
        {routes && routes.map((route: FlightRoute, index: number) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{route.airline}</td>
            <td>{route.codeShare}</td>
            <td>{route.sourceAirport}</td>
            <td>{route.destinationAirport}</td>
            <td>{route.stops}</td>
            <td>{route?.equipment || ""}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RoutesList;
