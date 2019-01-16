export function connectionJwtSnippet(connectionUrl: string): string {
  return `
var JwtGenerator = require('@convergence/jwt-util');
var privateKey = fs.readFileSync('test/private.key');
var keyId = "my-convergence-key";
var gen = new JwtGenerator(keyId, privateKey);
var claims = {firstName: "John", lastName: "Doe"};
var username = "jdoe";
var token = gen.generate(username, claims);

var url = "${connectionUrl}";
Convergence.connectJwt(url, "username", "password")
  .then(function (domain) {
    console.log("authentication success");
  })
  .catch(function (cause) {
    console.log("authentication failure:", cause);
  });`.trim();
}