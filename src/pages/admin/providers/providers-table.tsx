import React from "react";
import Table from "react-bootstrap/Table";
import { Provider } from "./index";

interface ProvidersTableProps {
  providers?: Array<Provider>;
}

const ProvidersTable = ({
  providers = [],
}: ProvidersTableProps) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>API URL</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {providers && providers.map((provider: Provider) => (
          <tr key={provider.id}>
            <td>{provider.id}</td>
            <td>{provider.name}</td>
            <td>{provider.apiUrl}</td>
            <td>{provider.active === false ? "Disabled" : "Active"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProvidersTable;
