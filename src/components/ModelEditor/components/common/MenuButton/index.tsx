import React, {ReactNode} from "react";
import {DropdownMenu} from "../DropdownMenu/";
import classNames from "classnames";
import styles from "./styles.module.css";

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

    const menu = this.state.showMenu ?
      <DropdownMenu onClose={this.hideMenu}>
        {this.props.children}
      </DropdownMenu> :
      null;

    const menuClasses = classNames(
      styles.menuButton,
      this.props.enabled ? styles.enabled : styles.disabled
    );

    return (
      <div className={styles.menuButtonWrapper}>
        <div className={menuClasses} onClick={this.showMenu}>
          <span className={styles.icons}>
            <i className={`fa fa-${this.props.icon} ${styles.icon}`}/>
            <i className={`fa fa-chevron-down ${styles.dropDown}`}/>
          </span>
        </div>
        <div className={styles.menuContainer}>
          {menu}
        </div>
      </div>
    );
  }
}
