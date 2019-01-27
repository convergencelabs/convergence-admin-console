import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/CodeSnippet";
import * as React from "react";

export const ModelOpenSnippet: React.FunctionComponent<{}> = () => {
  return (
    <CodeSnippet>
      <CodeSnippetDescription>
        This snippet demonstrates opening an existing model with a known model id.
      </CodeSnippetDescription>
      <Code>{`
const modelId = "my-model-id";
domain.models()
  .open(modelId)
  .then((model) => {
    console.log("model open");
    // use the model
  }).catch((error) => {
    console.log("Could not open the model", error);
  });
`.trim()}</Code>
    </CodeSnippet>
  );
}
