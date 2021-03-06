/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ReactNode} from "react";
import {DropdownMenu} from "../DropdownMenu/";
import classNames from "classnames";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";

export interface MenuButtonProps {
  icon: IconProp;
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
          <span className={styles.icon}>
            <FontAwesomeIcon icon={this.props.icon}/>
          </span>
          <span className={styles.dropDown}>
            <FontAwesomeIcon icon={faChevronDown}/>
          </span>
        </div>
        <div className={styles.menuContainer}>
          {menu}
        </div>
      </div>
    );
  }
}
