import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = "This snippet demonstrates opening a direct chat.";
const CODE = `
domain
  .chat()
  .direct("otherUserName")
  .then((directChat) => {
    directChat.on("message", event => console.log(event));
    directChat.send("Hello");
  }).catch((error) => {
    console.log("Could not join the activity", error);
  });`.trim();

export const DirectChatSnippet: React.FunctionComponent<{}> = () => {
  return (<CodeSnippet code={CODE} description={DESCRIPTION} />);
}
