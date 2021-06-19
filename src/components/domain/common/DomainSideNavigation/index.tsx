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
import {ReactNode} from 'react';
import {SideNavigation} from "../../../common/SideNavigation/";
import {toDomainRoute} from "../../../../utils/domain-url";
import {
  BlockOutlined,
  CloudOutlined,
  DashboardOutlined,
  FileOutlined,
  FolderOutlined,
  LockOutlined,
  MessageOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import {DomainAvailability} from "../../../../models/DomainAvailability";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";

export interface DomainSideNavigationProps {
  domainDescriptor: DomainDescriptor;
}

export class DomainSideNavigation extends React.Component<DomainSideNavigationProps, {}> {

  public render(): ReactNode {
    const {domainId, availability} = this.props.domainDescriptor;

    const dashboard = toDomainRoute( domainId, "");
    const users = toDomainRoute(domainId, "users");
    const groups = toDomainRoute(domainId, "groups/");
    const sessions = toDomainRoute(domainId, "sessions/");
    const collections = toDomainRoute(domainId, "collections/");
    const models = toDomainRoute(domainId, "models/");
    const chat = toDomainRoute(domainId, "chats/");
    const activity = toDomainRoute(domainId, "activities/");
    const settings = toDomainRoute(domainId, "settings/");
    const auth = toDomainRoute(domainId, "authentication/");

    const disabled = availability === DomainAvailability.OFFLINE;

    const menus = [
      {key: "dashboard", icon: <DashboardOutlined />, title: "Dashboard", link: dashboard, routeMatch: {path: dashboard, exact: true}},
      {key: "users", icon: <UserOutlined />, title: "Users", link: users, routeMatch: {path: users}, disabled},
      {key: "groups", icon: <TeamOutlined />, title: "Groups", link: groups, routeMatch: {path: groups}, disabled},
      {key: "sessions", icon: <CloudOutlined />, title: "Sessions", link: sessions, routeMatch: {path: sessions}, disabled},
      {key: "collections", icon: <FolderOutlined />, title: "Collections", link: collections,routeMatch: {path: collections}, disabled},
      {key: "models", icon: <FileOutlined />, title: "Models", link: models, routeMatch: {path: models}, disabled},
      {key: "chat", icon: <MessageOutlined />, title: "Chat", link: chat, routeMatch: {path: chat}, disabled},
      {key: "activity", icon: <BlockOutlined />, title: "Activity", link: activity, routeMatch: {path: activity}, disabled},
      {key: "authentication", icon: <LockOutlined />, title: "Authentication", link: auth, routeMatch: {path: auth}},
      {key: "settings", icon: <SettingOutlined />, title: "Settings", link: settings, routeMatch: {path: settings}}
    ];

    return (<SideNavigation menus={menus}/>);
  }
}
