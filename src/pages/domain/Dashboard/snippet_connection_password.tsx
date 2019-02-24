import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = `
This snippet demonstrates connecting to a domain and authenticating with a the username and password of
an existing domain user.`.trim();

export const ConnectionPasswordSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {
  const code = `
const url = "${props.connectionUrl}";
Convergence.connect(url, "username", "password")
  .then((domain) => {
    console.log("Connection success");
  })
  .catch((error) => {
    console.log("Connection failure", error);
  });`.trim();
  return (<CodeSnippet code={code} description={DESCRIPTION}/>);
}
