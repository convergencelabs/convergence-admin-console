import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/domain/common/CodeSnippet";
import * as React from "react";

export const ConnectionPasswordSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {
  return (
    <CodeSnippet>
      <CodeSnippetDescription>
        This snippet demonstrates connecting to a domain and authenticating with a the username and password of
        an existing domain user.
      </CodeSnippetDescription>
      <Code>{`
const url = "${props.connectionUrl}";
Convergence.connect(url, "username", "password")
  .then((domain) => {
    console.log("Connection success");
  })
  .catch((error) => {
    console.log("Connection failure", error);
  });`.trim()
      }</Code>
    </CodeSnippet>
  );
}
