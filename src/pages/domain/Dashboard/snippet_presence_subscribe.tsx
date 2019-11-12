/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = "This snippet demonstrates creating a presence list to observe user presence.";
const CODE = `
domain
  .presence()
  .subscribe("user1")
  .then((presence) => {
    presence.events().subscribe(event => console.log(event));
  }).catch((error) => {
    console.log("Could not subscribe to user, error);
  });`.trim();

export const PresenceSubscriptionSnippet: React.FunctionComponent<{}> = () => {
  return (<CodeSnippet code={CODE} description={DESCRIPTION} />);
}
