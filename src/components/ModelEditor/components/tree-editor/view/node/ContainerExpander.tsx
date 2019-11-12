/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinusSquare, faPlusSquare} from "@fortawesome/free-regular-svg-icons";

export interface ContainerExpanderProps {
  expanded: boolean,
  onToggle: () => void
}

export class ContainerExpander extends React.Component<ContainerExpanderProps, any> {
  public render(): ReactNode {
    const icon = this.props.expanded ? faMinusSquare : faPlusSquare;
    return (
      <span className="expander" onClick={this.props.onToggle}>
        <FontAwesomeIcon icon={icon} fixedWidth/>
      </span>
    );
  }
}
