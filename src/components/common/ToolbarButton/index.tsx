import React, {ReactNode} from "react";
import styles from "./styles.module.css";
import {Button} from "antd";
import Tooltip from "antd/es/tooltip";

export interface ToolbarButtonProps {
  icon: string;
  tooltip: string;
  onClick?: () => void;
}

export class ToolbarButton extends React.Component<ToolbarButtonProps, {}> {
  public render(): ReactNode {
    return (
      <Tooltip placement="topRight" title={this.props.tooltip} mouseEnterDelay={1}>
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
