import * as React from 'react';
import {SideNavigation, SideNavigationMenuItem} from "../SideNavigation";
import {ReactNode} from "react";

export class DomainSideNavigation extends React.Component<{}, {}> {

  private readonly _menus: SideNavigationMenuItem[] = [
    {key: "dashboard", icon: "home", title: "Home", link: "/", routeMatch: {path: "/", exact: true}},
    {key: "users", icon: "user", title: "Users", link: "users", routeMatch: {path: "/users"}},
    {key: "groups", icon: "contacts", title: "Groups", link: "groups", routeMatch: {path: "/groups"}},
    {key: "sessions", icon: "cloud", title: "Sessions", link: "sessions", routeMatch: {path: "/sessions"}},
    {key: "collections", icon: "folder", title: "Collections", link: "collections",routeMatch: {path: "/collections"}},
    {key: "models", icon: "file", title: "Models", link: "models", routeMatch: {path: "/models"}},
    {key: "settings", icon: "setting", title: "Settings", link: "settings", routeMatch: {path: "/settings"}}
  ];

  public render(): ReactNode {
    return (<SideNavigation menus={this._menus}/>);
  }
}
