import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/CodeSnippet";
import * as React from "react";

export const ConnectionJwtSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {
  return (
    <CodeSnippet>
      <CodeSnippetDescription>
        This snippet demonstrates connecting to a domain using a reconnect token from a previous session. It makes use of the
        Convergence Jwt Utility.
      </CodeSnippetDescription>
      <Code>
        {`
var JwtGenerator = require('@convergence/jwt-util');
var privateKey = fs.readFileSync('test/private.key');
var keyId = "my-convergence-key";
var gen = new JwtGenerator(keyId, privateKey);
var claims = {firstName: "John", lastName: "Doe"};
var username = "jdoe";
var token = gen.generate(username, claims);

var url = "${props.connectionUrl}";
Convergence.connectJwt(url, "username", "password")
  .then((domain) => {
    console.log("Connection success");
  })
  .catch((error) => {
    console.log("Connection failure", error);
  });
`.trim()
        }
      </Code>
    </CodeSnippet>
  );
}
