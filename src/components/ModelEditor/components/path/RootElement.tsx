/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from 'react';
import {PathClickCallback} from "./PathComponent";
import {ModelElement} from "../../model/ModelElement";

export interface RootElementProps {
  onSegmentClick: PathClickCallback;
  element: ModelElement<any>;
  label: string;
}

export class RootElement extends React.Component<RootElementProps, any> {

  constructor(props: RootElementProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(): void {
    this.props.onSegmentClick(this.props.element);
  }

  public render(): ReactNode {
    return (
      <span className="path-root" onClick={this.handleClick}>{this.props.label}</span>
    );
  }
}
