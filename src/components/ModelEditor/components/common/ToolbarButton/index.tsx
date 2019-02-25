import React, {ReactNode} from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";

export interface ToolbarButtonProps {
  icon: string;
  enabled: boolean;
  onClick: () => void;
}

export class ToolbarButton extends React.Component<ToolbarButtonProps, any> {
  public render(): ReactNode {
    const className = classNames(styles.toolbarButton, this.props.enabled ? styles.enabled : styles.disabled);
    const iconClassName = classNames("fa", `fa-${this.props.icon}`);

    return (
      <span className={className} onClick={this._onClick}>
        <i className={iconClassName} />
      </span>
    );
  }

  private _onClick = () => {
    if (this.props.enabled) {
      this.props.onClick();
    }
  }
}
