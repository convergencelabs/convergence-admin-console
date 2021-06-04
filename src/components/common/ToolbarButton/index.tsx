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
import {Button, Tooltip} from "antd";
import {TooltipPlacement} from "antd/lib/tooltip";

export interface ToolbarButtonProps {
  icon: ReactNode;
  tooltip: string;
  placement?: TooltipPlacement;
  onClick?: () => void;
  disabled?: boolean;
}

export class ToolbarButton extends React.Component<ToolbarButtonProps, {}> {
  public render(): ReactNode {
    return (
      <Tooltip 
        placement={this.props.placement || "topRight"} 
        title={this.props.tooltip} 
        mouseEnterDelay={1}
      >
        <Button className={styles.iconButton}
                shape="circle"
                size="small"
                htmlType="button"
                disabled={this.props.disabled}
                icon={this.props.icon}
                onClick={this._onClick}/>
      </Tooltip>
    );
  }

  private _onClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }
}
