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
import {ServerStatusStore} from "../../stores/ServerStatusStore";
import {OfflineOverlay} from "../../components/common/OfflineOverlay";

export interface InjectedProps extends RouteComponentProps {
  configStore: ConfigStore;
  configService: ConfigService;
  serverStatusStore: ServerStatusStore;
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
        <OfflineOverlay online={this.props.serverStatusStore.online} secondsUntilNextTry={this.props.serverStatusStore.secondsUntilNextCheck} />
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


const injections = [STORES.CONFIG_STORE, SERVICES.CONFIG_SERVICE, STORES.SERVER_STATUS_STORE];
export const MainLayout = injectObserver<RouteComponentProps>(injections, MainLayoutComponent);
