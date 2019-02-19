import React, {ReactNode} from "react";
import classNames from "classnames";

export interface ToolbarToggleButtonProps {
  icon: string;
  enabled: boolean;
  selected: boolean;
  onSelect: (selected: boolean) => void;
}

export interface ToolbarToggleButtonState {
  selected: boolean;
}

export class ToolbarToggleButton extends React.Component<ToolbarToggleButtonProps, ToolbarToggleButtonState> {

  constructor(props: ToolbarToggleButtonProps, context: any) {
    super(props, context);
    this.state = {
      selected: props.selected
    }
  }

  toggle = () => {
    if (this.props.enabled) {
      const selected = !this.state.selected;
      this.setState({
        selected: selected
      });

      this.props.onSelect(selected);
    }
  };

  public render(): ReactNode {
    const classes: any = {
      "toggle-button": true,
      fa: true
    };

    classes[`fa-${this.props.icon}`] = true;
    classes["enabled"] = this.props.enabled;
    classes["disabled"] = !this.props.enabled;
    classes["selected"] = this.state.selected;

    return <i className={classNames(classes)} onClick={this.toggle} />;
  }
}
