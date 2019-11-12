/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from 'react';
import {Link} from "react-router-dom";
import {observer} from "mobx-react";
import {Breadcrumb, Icon} from 'antd';
import {breadcrumbsStore, IBreadcrumbSegment} from "../../../stores/BreacrumsStore";
import styles from './styles.module.css';

export interface AppBreadcrumbsProps {
  hideHome?: boolean;
}

class AppBreadcrumbsComponent extends React.Component<AppBreadcrumbsProps, {}> {

  private _renderItems(): ReactNode[] {
    const breadcrumbs = breadcrumbsStore.breadcrumbs;
    return breadcrumbs ? breadcrumbs.map((v, i) => this._renderItem(v, i + 1)) : [];
  }

  private _renderItem(item: IBreadcrumbSegment, key: number): ReactNode {
    let icon: ReactNode;

    if (item.renderer) {
      icon = item.renderer();
    } else if (item.icon) {
      icon = <Icon type={item.icon}/>
    }

    const content = item.link ?
      <Link to={item.link}>{icon}{item.title}</Link> :
      <span>{icon}{item.title}</span>;

    return (
      <Breadcrumb.Item key={key}>{content}</Breadcrumb.Item>
    );
  }

  public render(): ReactNode {
    const home = this.props.hideHome ? null : this._renderItem({link: "/", icon: "home"}, 0);
    const children = this._renderItems();

    return (
      <Breadcrumb className={styles.breadcrumbs}>
        {home}
        {children}
      </Breadcrumb>
    );
  }
}

export const AppBreadcrumbs = observer(AppBreadcrumbsComponent);
