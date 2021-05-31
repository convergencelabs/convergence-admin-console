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

import React, {ReactNode} from "react";
import styles from './styles.module.css';

export interface CardTitleToolbarProps {
  title?: string;
  icon?: ReactNode;
}

export class CardTitleToolbar extends React.Component<CardTitleToolbarProps, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.toolbar}>
        <span>{this.props.icon} {this.props.title}</span>
        <span className={styles.spacer}/>
        {this.props.children}
      </div>
    );
  }
}
