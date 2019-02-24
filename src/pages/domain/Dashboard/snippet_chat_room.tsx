import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = "This snippet demonstrates joining a chat room.";
const CODE = `
const chatRoomId = "MyRoom";
domain
  .chat()
  .join(chatRoomId)
  .then((chatRoom) => {
    console.log("chat room joined");
  }).catch((error) => {
    console.log("Could not join the chat room", error);
  });`.trim();

export const ChatRoomSnippet: React.FunctionComponent<{}> = () => {
  return (<CodeSnippet code={CODE} description={DESCRIPTION} />);
}
