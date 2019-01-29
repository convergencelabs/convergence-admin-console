import * as React from 'react';
import {Component, ReactNode} from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {IconButtonAddon} from "../IconButtonAddon";

export interface CopyAddonButtonProps {
  copyText: string;
}

export class CopyAddonButton extends Component<CopyAddonButtonProps, {}> {
  public render(): ReactNode {
    return (
      <CopyToClipboard text={this.props.copyText}>
        <IconButtonAddon icon="copy"/>
      </CopyToClipboard>
    );
  }
}
