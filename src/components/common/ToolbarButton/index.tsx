import React, {ReactNode} from "react";
import styles from "./styles.module.css";
import {Button, Tooltip} from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";

export interface ToolbarButtonProps {
  icon: string;
  tooltip: string;
  placement?: TooltipPlacement;
  onClick?: () => void;
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
