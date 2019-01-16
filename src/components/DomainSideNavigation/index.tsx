import * as React from 'react';
import {Link} from 'react-router-dom';
import {Icon, Layout, Menu} from 'antd';
import styles from './styles.module.css';
const {Sider} = Layout;

export interface SideNavigationProps {
  // empty
}

export interface SideNavigationState {
  collapsed: boolean;
}

export class DomainSideNavigation extends React.Component<SideNavigationProps, SideNavigationState> {
  state = {
    collapsed: false
  };

  onCollapse = (collapsed: boolean) => {
    // console.log(collapsed);
    this.setState({collapsed});
  };

  onSelect = ({item, key, selectedKeys}: any) => {
    // console.log(key);
  };

  render() {
    return (
      <Sider className={styles.sideNavigation}
             collapsible
             collapsed={this.state.collapsed}
             onCollapse={this.onCollapse}
             width={230}
      >
        <Menu theme="dark"
              defaultSelectedKeys={['1']}
              mode="inline"
              inlineIndent={10}
              onSelect={this.onSelect}
              className={styles.navMenu}>
          <Menu.Item key="1">
            <Link to={{pathname: 'dashboard'}}>
              <Icon type="dashboard"/>
              <span>Dashboard</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to={{pathname: 'users'}}>
              <Icon type="user"/>
              <span>Users</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to={{pathname: 'groups'}}>
              <Icon type="contacts"/>
              <span>Groups</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to={{pathname: 'sessions'}}>
              <Icon type="cloud"/>
              <span>Sessions</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to={{pathname: 'collections'}}>
              <Icon type="folder"/>
              <span>Collections</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to={{pathname: 'models'}}>
              <Icon type="file"/>
              <span>Models</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="8">
            <Link to={{pathname: 'settings'}}>
              <Icon type="setting"/>
              <span>Settings</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}
