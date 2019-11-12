/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from 'react';
import onClickOutside from 'react-onclickoutside';
import styles from "./styles.module.css";

export interface DropdownMenuProps {
  onClose: () => void;
}

class DropdownMenuComponent extends React.Component<DropdownMenuProps, {}> {

  handleClickOutside() {
    this.props.onClose();
  }

  public render(): ReactNode {
    return (
      <div className={styles.menu} onClick={this.props.onClose}>
        {this.props.children}
      </div>
    );
  }
}

export const DropdownMenu = onClickOutside(DropdownMenuComponent);
