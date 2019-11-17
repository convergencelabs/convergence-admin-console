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
