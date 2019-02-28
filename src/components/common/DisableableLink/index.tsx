import React from "react";
import * as H from "history";
import {Link} from "react-router-dom";

export function DisableableLink(props: { to: H.LocationDescriptor, disabled?: boolean, children?: any}) {
  const {to, disabled} = props;
  return disabled ? props.children : <Link to={to}>{props.children}</Link>

}