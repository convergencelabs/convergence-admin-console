/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = `
This snippet demonstrates connecting to a domain using a reconnect token from a previous session.
`.trim();

export const ConnectionReconnectSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {
  const code = `
const url = "${props.connectionUrl}";
Convergence.reconnect(url, "my-reconnect-token")
  .then((domain) => {
    console.log("Connection success");
  })
  .catch((error) => {
    console.log("Connection failure", error);
  });
`.trim()

  return (<CodeSnippet code={code} description={DESCRIPTION}/>);
}
