/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import styles from "./styles.module.css";

export class FormButtonBar extends React.Component<{}, {}> {
  render(): ReactNode {
    return (
      <div className={styles.buttons}>
        {this.props.children}
      </div>
    );
  }
}
