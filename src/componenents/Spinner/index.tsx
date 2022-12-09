import Spinner from "react-bootstrap/Spinner";

function Loader() {
  return (
    <div className="flex h-center">
      <Spinner animation="border" role="status" style={{textAlign: "center"}}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loader;