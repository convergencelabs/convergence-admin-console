/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from 'react';
import {PathClickCallback} from "./PathComponent";
import {ModelElement} from "../../model/ModelElement";

export interface PropertyElementProps {
  element: ModelElement<any>;
  onClick: PathClickCallback
}

export class PropertyElement extends React.Component<PropertyElementProps, {}> {

  constructor(props: PropertyElementProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(): void {
    this.props.onClick(this.props.element);
  }

  public render(): ReactNode {
    return (
      <span>.<span className="path-prop"
                   onClick={this.handleClick}>{this.props.element.relativePathFromParent()}</span></span>
    );
  }
}
