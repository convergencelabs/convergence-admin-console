import React, {ReactNode} from "react";
import {ContextMenu} from "../menu/ContextMenu"
import classNames from "classnames";

export interface MenuButtonProps {
  icon: string;
  enabled: boolean;
}

export interface MenuButtonState {
  showMenu: boolean;
}

export class MenuButton extends React.Component<MenuButtonProps, MenuButtonState> {

  constructor(props: MenuButtonProps) {
    super(props);
    this.state = {
      showMenu: false
    }
  }

  showMenu = () => {
    if (this.props.enabled) {
      this.setState({showMenu: true});
    }
  };

  hideMenu = () => {
    this.setState({showMenu: false});
  };

  public render(): ReactNode {
    let menu = null;
    if (this.state.showMenu) {
      menu = (
        <ContextMenu onClose={this.hideMenu}>
          {this.props.children}
        </ContextMenu>
      );
    }

    const classes = classNames({
      "disabled": !this.props.enabled,
      "enabled": this.props.enabled
    });

    return (
      <div className="menu-button">
        <span className={classes} onClick={this.showMenu}>
          <i className={`fa fa-${this.props.icon}`}/>
          <i className={`fa fa-chevron-down drop-down`}/>
        </span>
        <div className="menu-container">
        {menu}
        </div>
      </div>
    );
  }
}
