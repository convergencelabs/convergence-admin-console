/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {MouseEvent, ReactNode} from 'react';
import {NumberNode} from "../../model/NumberNode";
import {AutoWidthInputField} from "../common/AutoWidthInputField";

export interface NumberEditorProps {
  node: NumberNode;
  onStopEdit: () => void;
  minWidth: number;
}

export class NumberEditor extends React.Component<NumberEditorProps, {}> {

  constructor(props: NumberEditorProps) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  public render(): ReactNode {
    return (
      <AutoWidthInputField
        className="number-editor"
        type="number"
        minWidth={20}
        padding={18}
        value={this.props.node.element().value() + ""}
        onEnter={this.props.onStopEdit}
        onEscape={this.props.onStopEdit}
        onChange={this._onChange}
        onMouseLeave={this._onMouseLeave}
        onBlur={this.props.onStopEdit}
      />
    );
  }

  private _onChange(value: string): void {
    const num: number = Number(value);
    this.props.node.element().value(num);
  }

  private _onMouseLeave(event: MouseEvent<HTMLInputElement>): void {
    if (event.target !== document.activeElement) {
      this.props.onStopEdit();
    }
  }
}
