/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import * as React from 'react';
import {Component, ReactNode} from 'react';
import styles from "./styles.module.css";

export class SpacedGrid extends Component<{}, {}> {
  render(): ReactNode {
    return (
      <div className={styles.grid}>
        {this.props.children}
      </div>
    );
  }
}
