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

import * as React from 'react';
import * as H from 'history';
import {UnregisterCallback} from 'history';
import { Layout, Menu } from 'antd';
import styles from './styles.module.css';
import {matchPath, RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {ReactNode} from "react";

const {Sider} = Layout;

export interface SideNavigationMenuItem {
  key: string;
  title: string;
  icon: ReactNode;
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
              className={styles.navMenu}>
          {
            this.props.menus.map(menu => (
              <Menu.Item key={menu.key}>
                <Link to={{pathname: menu.link}}>
                  {menu.icon}
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
