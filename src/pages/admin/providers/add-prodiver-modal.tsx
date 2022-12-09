import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Provider } from "./index";

interface IAddProviderModalProps {
  show: boolean;
  setShow: (isShow: boolean) => void;
  addProvider: (provider: Provider) => void;
}

const AddProviderModal = ({
  show,
  setShow,
  addProvider,
}: IAddProviderModalProps) => {
  const [provider, setProvider] = useState({});
  const handleClose = () => setShow(false);

  const onAddProvider = () => {
    addProvider(provider as Provider);
    handleClose();
  };

  const onChangeField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name.includes(".")) {
      const matchProps = name.split(".");
      setProvider({
        ...provider,
        matchRules: {
          ...(provider as Provider).matchRules,
          [matchProps[1]]: value,
        },
      });  
    } else {
      setProvider({
        ...provider,
        [name]: value,
      });
    }
  };

  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Provider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name*" name="name" onChange={onChangeField} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>API Url</Form.Label>
            <Form.Control type="text" placeholder="API Url*" name="apiUrl" onChange={onChangeField} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Match Rules (Optional)</Form.Label>
            <div className="flex">
              <div>
                <Form.Label>Airline Match</Form.Label>
                <Form.Control type="text" placeholder="Airline Match" name="matchRules.airline" onChange={onChangeField} />
              </div>
              <div>
                <Form.Label>SourceAirport Match</Form.Label>
                <Form.Control type="text" placeholder="SourceAirport Match" name="matchRules.sourceAirport" onChange={onChangeField} />
              </div>
              <div>
                <Form.Label>DestinationAirport Match</Form.Label>
                <Form.Control type="text" placeholder="DestinationAirport Match" name="matchRules.destinationAirport" onChange={onChangeField} />
              </div>
              <div>
                <Form.Label>CodeShare Match</Form.Label>
                <Form.Control type="text" placeholder="CodeShare Match" name="matchRules.codeShare" onChange={onChangeField} />
              </div>
              <div>
                <Form.Label>Stops Match</Form.Label>
                <Form.Control type="text" placeholder="Stops Match" name="matchRules.stops" onChange={onChangeField} />
              </div>
              <div>
                <Form.Label>Equipment Match</Form.Label>
                <Form.Control type="text" placeholder="Equipment Match" name="matchRules.equipment" onChange={onChangeField} />
              </div>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lambda Name/Url (Optional)</Form.Label>
            <Form.Control type="text" placeholder="Lambda URL/name (Optional)" name="lambda" onChange={onChangeField} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onAddProvider}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddProviderModal;
