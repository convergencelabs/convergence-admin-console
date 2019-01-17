import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/CodeSnippet";
import * as React from "react";

export const ConnectionReconnectSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {
  return (
    <CodeSnippet>
      <CodeSnippetDescription>
        This snippet demonstrates connecting to a domain using a reconnect token from a previous session.
      </CodeSnippetDescription>
      <Code>{`
const url = "${props.connectionUrl}";
Convergence.reconnect("my-reconnect-token")
  .then((domain) => {
    console.log("Connection success");
  })
  .catch((error) => {
    console.log("Connection failure", error);
  });
`.trim()
      }</Code>
    </CodeSnippet>
  );
}
