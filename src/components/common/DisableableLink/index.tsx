/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import * as H from "history";
import {Link} from "react-router-dom";

export function DisableableLink(props: { to: H.LocationDescriptor, disabled?: boolean, children?: any}) {
  const {to, disabled} = props;
  return disabled ? props.children : <Link to={to}>{props.children}</Link>

}