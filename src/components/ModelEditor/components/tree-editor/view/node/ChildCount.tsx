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

import React from 'react';
import classNames from 'classnames';

export interface ChildCountProps {
  visible: boolean,
  count: number
}

export interface ChildCountState {
  increased: boolean;
  decreased: boolean;
}

export class ChildCount extends React.Component<ChildCountProps, ChildCountState> {
  constructor(props: ChildCountProps) {
    super(props);

    this.state = {
      increased: false,
      decreased: false
    };
  }

  public componentDidUpdate(props: ChildCountProps): void {
    if (props.count !== this.props.count) {
      this.setState({
        increased: props.count > this.props.count,
        decreased: props.count < this.props.count
      });
      setTimeout(() => {
        this.setState({increased: false, decreased: false});
      }, 500);
    }
  }

  public render(): JSX.Element {
    const style = {
      display: this.props.visible ? 'inline' : 'none'
    };
    const classes = classNames({
      'count': true,
      'child-count-increase': this.state.increased,
      'child-count-decrease': this.state.decreased
    });

    return (
      <span className={classes} style={style}>{this.props.count}</span>
    );
  }
}
