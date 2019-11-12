/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import styles from "./styles.module.css";

export class InfoTable extends React.Component<{}, {}> {
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

export class InfoTableRow extends React.Component<{ label: string }, {}> {
  public render(): ReactNode {
    return (
      <tr>
        <td>{this.props.label}</td>
        <td>{this.props.children}</td>
      </tr>
    );
  }
}
