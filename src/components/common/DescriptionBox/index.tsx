/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from 'react';
import styles from './styles.module.css';

export class DescriptionBox extends React.Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.descriptionBox}>
        {this.props.children}
      </div>
    );
  }
}
