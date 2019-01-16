import * as React from 'react';
import { Avatar, Badge, Dropdown, Icon, Layout, Menu } from 'antd';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const { Header } = Layout;

export class AppHeader extends React.Component<{}, {}> {

  constructor(props: any) {
    super(props);
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
      <Menu.Item key="3"><Link to="/login"><Icon type="logout"/> Logout</Link></Menu.Item>
    </Menu>
  );

  render() {
    return (
      <Header className={styles.header}>
        <img src={logo} className={styles.logo}></img>
        <span className={styles.logoName}>Convergence</span>
        <span className={styles.slogan}>Admin Console</span>
        <Badge count={5}>
          <Icon type="mail" className={styles.icon}/>
        </Badge>
        <Icon type="bell" className={styles.icon}/>
        <Dropdown overlay={this._menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            <span className={styles.username}>Michael</span>
            <Avatar src="https://www.gravatar.com/avatar/e03ba1fbfb88cd40c52f4dac2ac9054c" />
          </a>
        </Dropdown>
      </Header>
    );
  }
}
