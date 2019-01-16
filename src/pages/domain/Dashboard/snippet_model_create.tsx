import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/CodeSnippet";
import * as React from "react";

const code = `
domain.models()
  .create({
    collection: "my-collection",
    data: {
      "string": "test value",
      "number": 10,
      "boolean": true,
      "array": [
        "Apples",
        "Bananas",
        "Pears",
        "Orange"
      ],
      "object": {
        "key1": "value1",
        "key2": "value2",
        "key3": "value3",
        "key4": "value4"
      }
    }
  })
  .then(() => console.log("model created"))
  .catch((error) => console.log("Could not open the model", error));
`.trim();

export const ModelCreateSnippet: React.FunctionComponent<{}> = () => {
  return (
    <CodeSnippet>
      <CodeSnippetDescription>
        This example demonstrates creating a Realtime Model in a specific collection, with some initial data.
      </CodeSnippetDescription>
      <Code>{code}</Code>
    </CodeSnippet>
  )
}
