import React, {ReactNode} from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export interface ToolbarRadioButtonProps {
  icon: IconProp;
  tooltip: string;
  enabled: boolean;
  selected: boolean;
  onSelect: () => void;
}

export class ToolbarRadioButton extends React.Component<ToolbarRadioButtonProps, {}> {

  constructor(props: ToolbarRadioButtonProps, context: any) {
    super(props, context);
  }

  public render(): ReactNode {
    const className = classNames(
      styles.toolbarRadioButton,
      this.props.enabled ? styles.enabled : styles.disabled,
      this.props.selected ? styles.selected : ""
    );

    return (
      <span className={className} onClick={this._onSelect}>
        <FontAwesomeIcon size="sm" icon={this.props.icon}/>
      </span>
    );
  }

  private _onSelect = () => {
    if (this.props.enabled) {
      this.props.onSelect();
    }
  };
}
