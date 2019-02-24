import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

export const ConnectionAnonymousSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {

  const description = `This snippet demonstrates connecting to a domain and authenticating anonymously and providing a Display Name
        for the anonymous user.`;

  const code = `
const url = "${props.connectionUrl}";
Convergence.connectAnonymously(url, "display name")
  .then((domain) => {
    console.log("Connection success");
  })
  .catch((error) => {
    console.log("Connection failure", error);
  });
`.trim();

  return (<CodeSnippet code={code} description={description} />);
}
