import { useAuthenticator } from "@aws-amplify/ui-react";
import { isAuth as getIsAuth } from "../../auth";
import ProvidersPage from "./providers";

const AdminPage = () => {
  const { authStatus } = useAuthenticator();
  const isAuth = getIsAuth(authStatus);

  return (
    <>
      {!isAuth && <h4>No Access</h4>}
      {
        isAuth && <div>
          Admin Page
          <ProvidersPage />
        </div>
      }
    </>
  );
};

export default AdminPage;