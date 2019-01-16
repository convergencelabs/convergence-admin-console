import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/CodeSnippet";
import * as React from "react";

export const ConnectionPasswordSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {
  return (
    <CodeSnippet>
      <CodeSnippetDescription>
        This example demonstrates creating a Realtime Model in a specific collection, with some initial data.
      </CodeSnippetDescription>
      <Code>{`
var url = "${props.connectionUrl}";
Convergence.connect(url, "username", "password")
  .then(function (domain) {
    console.log("authentication success");
  })
  .catch(function (cause) {
    console.log("authentication failure:", cause);
  });`.trim()
      }</Code>
    </CodeSnippet>
  );
}
