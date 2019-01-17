import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/CodeSnippet";
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
