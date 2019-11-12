/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {Component, ReactNode} from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {IconButtonAddon} from "../IconButtonAddon/";

export interface CopyAddonButtonProps {
  copyText: string;
}

export class CopyAddOnButton extends Component<CopyAddonButtonProps, {}> {
  public render(): ReactNode {
    return (
      <CopyToClipboard text={this.props.copyText}>
        <IconButtonAddon icon="copy"/>
      </CopyToClipboard>
    );
  }
}
