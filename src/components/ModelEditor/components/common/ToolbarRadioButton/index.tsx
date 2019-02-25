import React, {ReactNode} from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

export interface ToolbarRadioButtonProps {
  icon: string;
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

    const iconClassName = classNames("fa", `fa-${this.props.icon}`);
    const className = classNames(
      styles.toolbarRadioButton,
      this.props.enabled ? styles.enabled : styles.disabled,
      this.props.selected ? styles.selected : ""
    );

    return (
      <span className={className} onClick={this._onSelect}>
        <i className={iconClassName} title={this.props.tooltip}/>
      </span>
    );
  }

  private _onSelect = () => {
    if (this.props.enabled) {
      this.props.onSelect();
    }
  };
}
