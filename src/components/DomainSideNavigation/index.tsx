import * as React from 'react';
import {SideNavigation, SideNavigationMenuItem} from "../SideNavigation";
import {ReactNode} from "react";
import {DomainId} from "../../models/DomainId";
import {toDomainUrl} from "../../utils/domain-url";

export interface DomainSideNavigationProps {
  domainId: DomainId
}

export class DomainSideNavigation extends React.Component<DomainSideNavigationProps, {}> {

  private readonly _menus: SideNavigationMenuItem[];

  constructor(props: DomainSideNavigationProps) {
    super(props);

    const {domainId} = this.props;
    const dashboard = toDomainUrl("", domainId, "");
    const users = toDomainUrl("", domainId, "users");
    const groups = toDomainUrl("", domainId, "groups/");
    const sessions = toDomainUrl("", domainId, "sessions/");
    const collections = toDomainUrl("", domainId, "collections/");
    const models = toDomainUrl("", domainId, "models/");
    const chat = toDomainUrl("", domainId, "chat/");
    const settings = toDomainUrl("", domainId, "settings/");
    const auth = toDomainUrl("", domainId, "authentication/");

    this._menus = [
      {key: "dashboard", icon: "dashboard", title: "Dashboard", link: dashboard, routeMatch: {path: dashboard, exact: true}},
      {key: "users", icon: "user", title: "Users", link: users, routeMatch: {path: users}},
      {key: "groups", icon: "team", title: "Groups", link: groups, routeMatch: {path: groups}},
      {key: "sessions", icon: "cloud", title: "Sessions", link: sessions, routeMatch: {path: sessions}},
      {key: "collections", icon: "folder", title: "Collections", link: collections,routeMatch: {path: collections}},
      {key: "models", icon: "file", title: "Models", link: models, routeMatch: {path: models}},
      {key: "chat", icon: "message", title: "Chat", link: chat, routeMatch: {path: chat}},
      {key: "authentication", icon: "lock", title: "Authentication", link: auth, routeMatch: {path: auth}},
      {key: "settings", icon: "setting", title: "Settings", link: settings, routeMatch: {path: settings}}
    ];
  }

  public render(): ReactNode {
    return (<SideNavigation menus={this._menus}/>);
  }
}
