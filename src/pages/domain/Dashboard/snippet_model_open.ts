export const modelOpenSnippet = `
const modelId = "my-model-id";
domain.models()
  .open(modelId)
  .then((model) => {
    console.log("model open");
    // use the model
  }).catch((error) => {
    console.log("Could not open the model", error);
  });`.trim();
