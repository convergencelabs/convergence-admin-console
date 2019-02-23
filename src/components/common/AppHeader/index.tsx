import React, {ReactNode} from 'react';
import {Avatar, Badge, Dropdown, Icon, Layout, Menu, Popover, Tooltip} from 'antd';
import styles from './styles.module.css';
import logo from '../../../assets/images/logo.png';
import {authStore} from "../../../stores/AuthStore";
import {localStorageService} from "../../../services/LocalStorageService";
import {injectAs} from "../../../utils/mobx-utils";
import {STORES} from "../../../stores/StoreConstants";
import {ProfileStore} from "../../../stores/ProfileStore";
import {Link} from "react-router-dom";
import md5 from "md5";

interface InjectedProps {
  profileStore: ProfileStore;
}

class AppHeaderComponent extends React.Component<InjectedProps, {}> {

  private _logout = () => {
    authStore.logout();
    localStorageService.clearAuthToken();
  }

  private _menu = (
    <Menu className={styles.userMenu}>
      <Menu.Item key="0">
        <Link to={"/profile"}><Icon type="profile"/>Profile</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <a><Icon type="setting"/> Settings</a>
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item key="3" onClick={this._logout}><Icon type="logout"/> Logout</Menu.Item>
    </Menu>
  );

  public render(): ReactNode {
    const {displayName, email} = this.props.profileStore.profile!;
    const emailHash = md5(email);
    return (
      <Layout.Header className={styles.header}>
        <img src={logo} className={styles.logo}/>
        <span className={styles.logoName}>Convergence</span>
        <span className={styles.slogan}>Convergence Admin Console</span>
        <Badge count={0}>
          <Tooltip title={"No Alerts"} mouseEnterDelay={1}>
          <Icon type="bell" className={styles.icon}/>
          </Tooltip>
        </Badge>
        <Dropdown overlay={this._menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            <span className={styles.username}>{displayName}</span>
            <Avatar src={`https://www.gravatar.com/avatar/${emailHash}?d=mp`}/>
            <Icon className={styles.down} type="down"/>
          </a>
        </Dropdown>
      </Layout.Header>
    );
  }
}
const injections = [STORES.PROFILE_STORE];
export const AppHeader = injectAs<{}>(injections, AppHeaderComponent);
