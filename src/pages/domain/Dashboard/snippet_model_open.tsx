import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = "This snippet demonstrates opening an existing model with a known model id.";
const CODE = `
const modelId = "my-model-id";
domain.models()
  .open(modelId)
  .then((model) => {
    console.log("model open");
    // use the model
  }).catch((error) => {
    console.log("Could not open the model", error);
  });`.trim();

export const ModelOpenSnippet: React.FunctionComponent<{}> = () => {
  return (<CodeSnippet code={CODE} description={DESCRIPTION} />);
}
