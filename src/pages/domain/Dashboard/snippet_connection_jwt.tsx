import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = (
  <div>
    This snippet demonstrates connecting to a domain using a trusted JSON Web Token (JWT). It makes use of the
    <a href="https://www.npmjs.com/package/@convergence/jwt-util" target="_blank"> Convergence Jwt Utility</a> to
    simplify the creation of appropriate JTWs.
  </div>);

export const ConnectionJwtSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {
  const code = `
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
`.trim();

  return (<CodeSnippet code={code} description={DESCRIPTION}/>);
}
