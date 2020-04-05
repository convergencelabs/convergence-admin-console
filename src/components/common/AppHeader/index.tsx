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

import React, {ReactNode} from 'react';
import {Avatar, Badge, Dropdown, Icon, Layout, Menu, Tooltip} from 'antd';
import styles from './styles.module.css';
import logo from '../../../assets/images/logo.png';
import {authStore} from "../../../stores/AuthStore";
import {localStorageService} from "../../../services/LocalStorageService";
import {injectAs} from "../../../utils/mobx-utils";
import {STORES} from "../../../stores/StoreConstants";
import {LoggedInUserStore} from "../../../stores/LoggedInUserStore";
import {Link} from "react-router-dom";
import md5 from "md5";

interface InjectedProps {
  profileStore: LoggedInUserStore;
}

class AppHeaderComponent extends React.Component<InjectedProps, {}> {

  private _logout = () => {
    authStore.logout();
    localStorageService.clearAuthToken();
  }

  private _menu = (
    <Menu className={styles.userMenu}>
      <Menu.Item key="profile">
        <Link to={"/profile"}><Icon type="profile"/>Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings">
        <Link to={"/account-settings"}><Icon type="setting"/>Settings</Link>
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item key="logout" onClick={this._logout}><Icon type="logout"/> Logout</Menu.Item>
    </Menu>
  );

  public render(): ReactNode {
    const {displayName, email} = this.props.profileStore.loggedInUser!;
    const emailHash = md5(email);
    return (
      <Layout.Header className={styles.header}>
        <img alt="Convergence Logo" src={logo} className={styles.logo}/>
        <span className={styles.logoName}>Convergence</span>
        <span className={styles.slogan}>Admin Console</span>
        <Badge count={0}>
          <Tooltip title={"No Alerts"} mouseEnterDelay={1}>
          <Icon type="bell" className={styles.icon}/>
          </Tooltip>
        </Badge>
        <Dropdown overlay={this._menu} trigger={['click']}>
          <span className="ant-dropdown-link" style={{cursor: "pointer"}}>
            <span className={styles.username}>{displayName}</span>
            <Avatar src={`https://www.gravatar.com/avatar/${emailHash}?d=mp`}/>
            <Icon className={styles.down} type="down"/>
          </span>
        </Dropdown>
      </Layout.Header>
    );
  }
}
const injections = [STORES.PROFILE_STORE];
export const AppHeader = injectAs<{}>(injections, AppHeaderComponent);
