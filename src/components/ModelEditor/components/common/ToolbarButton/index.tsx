import React, {ReactNode} from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export interface ToolbarButtonProps {
  icon: IconProp;
  enabled: boolean;
  onClick: () => void;
}

export class ToolbarButton extends React.Component<ToolbarButtonProps, any> {
  public render(): ReactNode {
    const className = classNames(styles.toolbarButton, this.props.enabled ? styles.enabled : styles.disabled);
    return (
      <span className={className} onClick={this._onClick}>
        <FontAwesomeIcon size="sm" icon={this.props.icon}/>
      </span>
    );
  }

  private _onClick = () => {
    if (this.props.enabled) {
      this.props.onClick();
    }
  }
}
