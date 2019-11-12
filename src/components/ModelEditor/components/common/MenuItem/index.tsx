/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from 'react';
import styles from "./styles.module.css";

export interface MenuItemProps {
  label: string;
  onClick: () => void;
}

export class MenuItem extends React.Component<MenuItemProps, any> {

  onClick = () => {
    try {
      this.props.onClick();
    } catch (err) {
      console.log(err);
    }
  };

  public render(): ReactNode {
    return (
      <div className={styles.menuItem} onClick={this.onClick}>{this.props.label}</div>
    );
  }
}
