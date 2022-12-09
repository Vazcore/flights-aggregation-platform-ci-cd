import { API } from "aws-amplify";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { generateId } from "../../../auth";
import AddProviderModal from "./add-prodiver-modal";
import ProvidersTable from "./providers-table";

export interface ProviderMatchRules {
  airline: string;
  sourceAirport: string;
  destinationAirport: string;
  codeShare: string;
  stops: string;
  equipment: string;
}

export interface Provider {
  id?: number;
  name: string;
  apiUrl: string;
  matchRules?: ProviderMatchRules,
  lambda?: string;
  active?: boolean;
}

const ProvidersPage = () => {
  const [showAddProviderModal, setShowAddProviderModal] = useState<boolean>(false);
  const [providers, setProviders] = useState<Array<Provider>>([]); 

  const fetchProviders = useCallback(() => {
    API.get("providerscicdapi", "/providers", {}).then((data) => setProviders(data));
  }, [setProviders]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const onAddProvider = async (provider: Provider) => {
    const response = await API.post("providerscicdapi", "/providers", {
      body: {
        ...provider,
        id: generateId(),
      }
    });

    if (response.success) {
      fetchProviders();
    }
  };

  return (<div>
    <h4>Providers</h4>
    <Button variant="primary" className="m-bottom-20" onClick={() => setShowAddProviderModal(true)}>
      Add Provider
    </Button>
    <ProvidersTable providers={providers} />
    <AddProviderModal show={showAddProviderModal} setShow={setShowAddProviderModal} addProvider={onAddProvider} />
  </div>);
};

export default ProvidersPage;
