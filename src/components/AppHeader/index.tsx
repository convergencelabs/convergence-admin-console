import * as React from 'react';
import { Avatar, Badge, Dropdown, Icon, Layout, Menu } from 'antd';
import styles from './styles.module.css';
import logo from '../../assets/images/logo.png';
import {authStore} from "../../stores/AuthStore";
import {localStorageService} from "../../services/LocalStorageService";

const { Header } = Layout;

export class AppHeader extends React.Component<{}, {}> {

  private _logout = () => {
    authStore.logout();
    localStorageService.clearAuthToken();
  }

  private _menu = (
    <Menu className={styles.userMenu}>
      <Menu.Item key="0">
        <a><Icon type="profile"/> Profile</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a><Icon type="setting"/> Settings</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={this._logout}><Icon type="logout"/> Logout</Menu.Item>
    </Menu>
  );

  render() {
    return (
      <Header className={styles.header}>
        <img src={logo} className={styles.logo}/>
        <span className={styles.logoName}>Convergence</span>
        <span className={styles.slogan}>Convergence Admin Console</span>
        <Badge count={5}>
          <Icon type="bell" className={styles.icon}/>
        </Badge>
        <Dropdown overlay={this._menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            <span className={styles.username}>Michael</span>
            <Avatar src="https://www.gravatar.com/avatar/e03ba1fbfb88cd40c52f4dac2ac9054c" />
            <Icon className={styles.down} type="down"/>
          </a>
        </Dropdown>
      </Header>
    );
  }
}
