/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

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
