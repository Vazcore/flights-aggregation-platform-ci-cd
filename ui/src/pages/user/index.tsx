import React from "react";
import { Authenticator, useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import config from "../../secret/aws-exports";

const UserPage = () => {
  return (<div>Sign in ...</div>);
};

export default withAuthenticator(UserPage);
