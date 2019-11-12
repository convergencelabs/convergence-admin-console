/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import styles from "./styles.module.css";

export class Loading extends React.Component<{ loading: boolean }, {}> {
  render(): ReactNode {
    return (
      <table className={styles.infoTable}>
        <tbody>
        {this.props.children}
        </tbody>
      </table>
    );
  }
}
