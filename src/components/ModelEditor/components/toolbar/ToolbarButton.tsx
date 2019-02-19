import React, {ReactNode} from "react";

export interface ToolbarButtonProps {
  icon: string;
  enabled: boolean;
  onClick: () => void;
}

export class ToolbarButton extends React.Component<ToolbarButtonProps, any> {
  public render(): ReactNode {
    return <i className={`fa fa-${this.props.icon} button ${this.props.enabled ? 'enabled' : 'disabled'}`}
              onClick={() => this.props.enabled && this.props.onClick()}/>;
  }
}
