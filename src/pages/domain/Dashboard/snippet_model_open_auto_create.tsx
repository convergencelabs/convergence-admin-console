import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/domain/common/CodeSnippet";
import * as React from "react";

export const ModelOpenAutoCreate: React.FunctionComponent<{}> = () => {
  return (
    <CodeSnippet>
      <CodeSnippetDescription>
        This snippet demonstrates opening or creating a model using the openAutoCreate method. If the model
        exists, it will be opened. If the model does not exist it will be created and then opened.
      </CodeSnippetDescription>
      <Code>{`
domain.models()
  .openAutoCreate({
    id: "my-model-id",
    collection: "my-collection",
    ephemeral: true,
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
  .then((model) => {
    console.log("model open");
    // use the model
  })
  .catch((error) => {
    console.log("Could not open the model", error);
  });`.trim()}</Code>
    </CodeSnippet>
  );
}

