import * as React from 'react';
import {SideNavigation, SideNavigationMenuItem} from "../SideNavigation/index";
import {ReactNode} from "react";

export class ServerSideNavigation extends React.Component<{}, {}> {

  private readonly _menus: SideNavigationMenuItem[] = [
    {key: "home", icon: "home", title: "Home", link: "/", routeMatch: {path: "/", exact: true}},
    {key: "namespaces", icon: "folder", title: "Namespaces", link: "/namespaces", routeMatch: {path: "/namespaces"}},
    {key: "domains", icon: "database", title: "Domains", link: "/domains", routeMatch: {path: "/domains"}},
    {key: "users", icon: "user", title: "Users", link: "/users",routeMatch: {path: "/users"}},
    {key: "settings", icon: "setting", title: "Settings", link: "/settings", routeMatch: {path: "/settings"}}
  ];

  public render(): ReactNode {
    return (<SideNavigation menus={this._menus}/>);
  }
}
