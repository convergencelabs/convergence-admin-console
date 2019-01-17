import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/CodeSnippet";
import * as React from "react";

export const ConnectionAnonymousSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {
  return (
    <CodeSnippet>
      <CodeSnippetDescription>
        This snippet demonstrates connecting to a domain and authenticating anonymously and providing a Display Name
        for the anonymous user.
      </CodeSnippetDescription>
      <Code>{`
const url = "${props.connectionUrl}";
Convergence.connectAnonymously(url, "display name")
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
