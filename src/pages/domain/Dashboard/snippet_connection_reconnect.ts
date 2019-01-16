export function connectionReconnectSnippet(connectionUrl: string): string {
  return `var url = "${connectionUrl}";
Convergence.connect(url, "username", "password")
  .then(function (domain) {
    console.log("authentication success");
  })
  .catch(function (cause) {
    console.log("authentication failure:", cause);
  });`
}