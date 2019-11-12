/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import {Route, RouteComponentProps, Switch} from 'react-router';
import {Layout} from 'antd';
import {AppHeader} from "../../components/common/AppHeader";
import {AppBreadcrumbs} from "../../components/common/AppBreadcrumbs";
import {ServerContainer} from "../Server";
import {DomainContainer} from "../Domain";
import {STORES} from "../../stores/StoreConstants";
import {SERVICES} from "../../services/ServiceConstants";
import {injectObserver} from "../../utils/mobx-utils";
import {ConfigStore} from "../../stores/ConfigStore";
import {ConfigService} from "../../services/ConfigService";
import styles from './style.module.css';

export interface InjectedProps extends RouteComponentProps {
  configStore: ConfigStore;
  configService: ConfigService;
}

export class MainLayoutComponent extends React.Component<InjectedProps, {}> {

  public componentDidMount(): void {
    if (!this.props.configStore.configLoaded) {
      this.props.configService.getNamespaceConfig().then(nsConfig => {
        this.props.configStore.setNamespacesEnabled(nsConfig.namespacesEnabled);
        this.props.configStore.setUserNamespacesEnabled(nsConfig.userNamespacesEnabled);
        this.props.configStore.setDefaultNamespace(nsConfig.defaultNamespace);
        this.props.configStore.setConfigLoaded(true);
      })
    }
  }

  public render(): ReactNode {
    return this.props.configStore.configLoaded ? (
      <div className={styles.mainLayout}>
        <Layout>
          <AppHeader/>
          <AppBreadcrumbs/>
          <Switch>
            <Route path='/domain/:namespace/:domainId/' component={DomainContainer}/>
            <Route path='/' component={ServerContainer}/>
          </Switch>
        </Layout>
      </div>
    ) : null;
  }
}


const injections = [STORES.CONFIG_STORE, SERVICES.CONFIG_SERVICE];
export const MainLayout = injectObserver<RouteComponentProps>(injections, MainLayoutComponent);
