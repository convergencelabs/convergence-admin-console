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
import * as H from "history";
import {Link} from "react-router-dom";

export function DisableableLink(props: { to: H.LocationDescriptor, disabled?: boolean, children?: any}) {
  const {to, disabled} = props;
  return disabled ? props.children : <Link to={to}>{props.children}</Link>

}