/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = `
This snippet demonstrates connecting to a domain and authenticating with a the username and password of
an existing domain user.`.trim();

export const ConnectionPasswordSnippet: React.FunctionComponent<{ connectionUrl: string }> = (props) => {
  const code = `
const url = "${props.connectionUrl}";
Convergence.connect(url, "username", "password")
  .then((domain) => {
    console.log("Connection success");
  })
  .catch((error) => {
    console.log("Connection failure", error);
  });`.trim();
  return (<CodeSnippet code={code} description={DESCRIPTION}/>);
}
