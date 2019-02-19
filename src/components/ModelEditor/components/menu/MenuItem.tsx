import React, {ReactNode} from 'react';

export interface MenuItemProps {
  label: string;
  onClick: () => void;
}

export class MenuItem extends React.Component<MenuItemProps, any> {

  onClick = () => {
    try {
      this.props.onClick();
    } finally {
    }
  };

  public render(): ReactNode {
    return (
      <div className="sapphire-menu-item" onClick={this.onClick}>{this.props.label}</div>
    );
  }
}
