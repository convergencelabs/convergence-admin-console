/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import * as React from 'react';
import styles from "./style.module.css";

export class Root extends React.Component<{}, {}> {
  render() {
    return (
      <div className={styles.appRoot}>
        {this.props.children}
      </div>
    );
  }
}
