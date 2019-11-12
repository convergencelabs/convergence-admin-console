/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import styles from "./styles.module.css";

export class MessagePage extends React.Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {this.props.children}
        </div>
      </div>
    );
  }
}