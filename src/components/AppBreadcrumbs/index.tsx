import * as React from 'react';
import styles from './styles.module.css';
import {Breadcrumb, Icon} from 'antd';
import {ReactNode} from 'react';
import {Link} from "react-router-dom";
import {breadcrumbStore, IBreadcrumbSegment} from "../../stores/BreacrumStore";
import {observer} from "mobx-react";

export interface AppBreadcrumbsProps {
  hideHome?: boolean;
}

export interface AppBreadcrumbsState {
// empty
}

export class AppBreadcrumbsComponent extends React.Component<AppBreadcrumbsProps, AppBreadcrumbsState> {

  private _renderItems(): ReactNode[] {
    const breadcrumbs = breadcrumbStore.breadcrumbs;
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

  render() {
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
