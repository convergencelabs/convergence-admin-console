import * as React from 'react';
import * as H from 'history';
import {UnregisterCallback} from 'history';
import {Icon, Layout, Menu} from 'antd';
import styles from './styles.module.css';
import {matchPath, RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";

const {Sider} = Layout;

export interface SideNavigationMenuItem {
  key: string;
  title: string;
  icon: string;
  link: string;
  routeMatch: {
    path: string;
    exact?: boolean;
  }
}

export interface SideNavigationProps extends RouteComponentProps {
  menus: SideNavigationMenuItem[];
}

export interface SideNavigationState {
  collapsed: boolean;
}

export class SideNavigationComponent extends React.Component<SideNavigationProps, SideNavigationState> {
  private _historyUnregister: UnregisterCallback | null = null;

  state = {
    collapsed: false
  };

  onCollapse = (collapsed: boolean) => {
    this.setState({collapsed});
  };

  onSelect = ({item, key, selectedKeys}: any) => {
    // console.log(key);
  };

  public componentDidMount(): void {
    this._historyUnregister = this.props.history.listen(() => this.forceUpdate());
  }

  public componentWillUnmount(): void {
    if (this._historyUnregister !== null) {
      this._historyUnregister();
    }
  }

  render() {
    const selectProps = {selectedKeys: [this._selectMenuFromRoute(this.props.location)]};
    return (
      <Sider className={styles.sideNavigation}
             collapsible
             collapsed={this.state.collapsed}
             onCollapse={this.onCollapse}
             width={230}
      >
        <Menu theme="dark"
              defaultSelectedKeys={["home"]}
              {...selectProps}
              mode="inline"
              inlineIndent={10}
              onSelect={this.onSelect}
              className={styles.navMenu}>
          {
            this.props.menus.map(menu => (
              <Menu.Item key={menu.key}>
                <Link to={{pathname: menu.link}}>
                  <Icon type={menu.icon}/>
                  <span>{menu.title}</span>
                </Link>
              </Menu.Item>
            ))
          }
        </Menu>
      </Sider>
    );
  }

  private _selectMenuFromRoute = (location: H.Location) => {

    const found = Object.values(this.props.menus).find((menu) =>
      matchPath(location.pathname, {...menu.routeMatch}) !== null
    );

    return found ? found.key : "";
  }
}

export const SideNavigation = withRouter(SideNavigationComponent);
