import React, {ReactNode} from "react";
import classNames from "classnames";

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

  onSelect = () => {
    if (this.props.enabled) {
      this.props.onSelect();
    }
  };

  public render(): ReactNode {
    const classes: any = {
      "radio-button": true,
      fa: true
    };

    classes[`fa-${this.props.icon}`] = true;
    classes["enabled"] = this.props.enabled;
    classes["disabled"] = !this.props.enabled;
    classes["selected"] = this.props.selected;

    return <i className={classNames(classes)} onClick={this.onSelect} title={this.props.tooltip}/>;
  }
}
