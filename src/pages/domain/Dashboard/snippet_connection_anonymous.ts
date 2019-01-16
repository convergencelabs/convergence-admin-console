export function connectionAnonymousSnippet(connectionUrl: string): string {
  return `
var url = "${connectionUrl}";
Convergence.connectAnonymously(url, "display name")
  .then(function (domain) {
    console.log("authentication success");
  })
  .catch(function (cause) {
    console.log("authentication failure:", cause);
  });
`.trim();
}
