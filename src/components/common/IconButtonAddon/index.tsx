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
import styles from "./styles.module.css";
import {Button} from "antd";

export interface IconButtonAddonProps {
  icon: string;
  onClick?: (e: any) => void
}

export class IconButtonAddon extends React.Component<IconButtonAddonProps, {}> {
  public render(): ReactNode {
    return (
      <Button onClick={this.props.onClick}
              className={styles.iconButton}
              icon={this.props.icon}
              htmlType="button"
      />
    );
  }
}
