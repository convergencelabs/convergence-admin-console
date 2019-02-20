import {Code, CodeSnippet, CodeSnippetDescription} from "../../../components/domain/common/CodeSnippet";
import * as React from "react";

export const ModelDataSnippet: React.FunctionComponent<{}> = () => {
  return (
    <CodeSnippet>
      <CodeSnippetDescription>
        This snippet demonstrates opening a model and working with the Realtime data model.
      </CodeSnippetDescription>
      <Code>{`
var modelId = "myModel";
domain.models
  .open(modelId)
  .then(model => {
    // the model is {firstName: “Fred”, lastName: “Flanders”}
    // A real time string
    const firstName = model.elementAt("firstName");

    firstName.on(Convergence.RealTimeString.Events.VALUE, evt => {
      console.log(firstName.value());
    });

    firstName.on(Convergence.RealTimeString.Events.INSERT, evt => {
      console.log(firstName.value());
    }); firstName.on(Convergence.RealTimeString.Events.REMOVE, evt => {
      console.log(firstName.value());
    });

    // Listen to course grained events
    firstName.on("model_changed", evt => {
      console.log("change");
    });

    // Set the string
    firstName.set("Ted"); // "Ted", "change"

    // Delete the "T" at index 1
    firstName.remove(0, 1); // "ed", "change"

    // Insert an "N" at index 0.
    firstName.insert("N", 0); // "Ned", "change"
  });
`.trim()}</Code>
    </CodeSnippet>
  );
}
