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
import {Route, RouteComponentProps, Switch} from 'react-router';
import {DomainSideNavigation} from "../../components/";
import {DomainDashboard} from "../../pages/domain/Dashboard/";
import {DomainService} from "../../services/DomainService";
import {NavLayout} from "../../components/common/NavLayout";
import {DomainCollections} from "../../pages/domain/collections/DomainCollections";
import {CreateDomainCollection} from "../../pages/domain/collections/CreateDomainCollection";
import {EditDomainCollection} from "../../pages/domain/collections/EditDomainCollection";
import {DomainModels} from "../../pages/domain/models/DomainModels";
import {CreateDomainModel} from "../../pages/domain/models/CreateDomainModel";
import {EditDomainModel} from "../../pages/domain/models/EditDomainModel";
import {injectObserver} from "../../utils/mobx-utils";
import {ActiveDomainStore} from "../../stores/ActiveDomainStore";
import {DomainId} from "../../models/DomainId";
import {SERVICES} from "../../services/ServiceConstants";
import {STORES} from "../../stores/StoreConstants";
import {DomainUsers} from "../../pages/domain/users/DomainUsers";
import {CreateDomainUser} from "../../pages/domain/users/CreateDomainUser";
import {EditDomainUser} from "../../pages/domain/users/EditDomainUser";
import {SetDomainUserPassword} from "../../pages/domain/users/SetDomainUserPassword";
import {DomainUserGroups} from "../../pages/domain/groups/DomainUserGroups";
import {CreateDomainUserGroup} from "../../pages/domain/groups/CreateDomainUserGroup";
import {EditDomainUserGroup} from "../../pages/domain/groups/EditDomainUserGroup";
import {DomainAuthentication} from "../../pages/domain/auth/";
import {DomainSettings} from "../../pages/domain/settings";
import {DomainChats} from "../../pages/domain/chats/DomainChats";
import {CreateDomainChat} from "../../pages/domain/chats/CreateDomainChat";
import {EditDomainChat} from "../../pages/domain/chats/EditDomainChat";
import {CreateDomainJwtKey} from "../../pages/domain/auth/jwt/CreateDomainJwtKey";
import {EditDomainJwtKey} from "../../pages/domain/auth/jwt/EditDomainJwtKey";
import {DomainSessions} from "../../pages/domain/sessions/DomainSessions";
import {PageNotFound} from "../../components/common/PageNotFound";
import {DomainStatus} from "../../models/DomainStatus";
import {DomainLoading} from "../../components/domain/common/DomainLoading";
import {ErrorPage} from "../../components/common/ErrorPage";
import {DomainInitializing} from "../../components/domain/common/DomainInitializing";
import {BreadcrumbsStore} from "../../stores/BreacrumsStore";
import {ConfigStore} from "../../stores/ConfigStore";
import {ViewChat} from "../../pages/domain/chats/ViewChat";
import {DomainBanner} from "../../components/domain/Banner";

export interface DomainRouteParams {
  namespace: string;
  domainId: string;
}

interface DomainContainerProps extends RouteComponentProps<DomainRouteParams> {
  domainService: DomainService;
  activeDomainStore: ActiveDomainStore;
  breadcrumbsStore: BreadcrumbsStore;
  configStore: ConfigStore;
}

export class DomainContainerComponent extends React.Component<DomainContainerProps> {

  public componentDidMount() {
    const domainId = this._extractNamespaceAndDomain();
    this.props.breadcrumbsStore.setDomain(domainId);
    this.props.activeDomainStore.activateDomain(domainId);
  }

  public componentWillUnmount() {
    this.props.activeDomainStore.deactivate();
    this.props.breadcrumbsStore.setDomain(null);
  }

  public componentDidUpdate() {
    const domainId = this._extractNamespaceAndDomain();
    this.props.breadcrumbsStore.setDomain(domainId);
  }

  public render(): ReactNode {
    const {match} = this.props;
    const {domainDescriptor, error} = this.props.activeDomainStore;

    if (error !== null) {
      return (<ErrorPage title="Error Loading Domain" message={error}/>);
    } else if (domainDescriptor === null) {
      return <DomainLoading/>;
    } else if (domainDescriptor!.status === DomainStatus.INITIALIZING) {
      return <DomainInitializing/>;
    } else if (domainDescriptor!.status === DomainStatus.DELETING) {
      return (<ErrorPage title="Domain Deleting" message="This domain can not be used because is being deleted."/>);
    } else {
      const domainId = domainDescriptor.domainId;
      return (
          <React.Fragment>
            <DomainBanner domainDescriptor={domainDescriptor} />
          <NavLayout sideNav={<DomainSideNavigation domainDescriptor={domainDescriptor}/>}>
            <Switch>
              <Route exact path={`${match.url}/`}
                     render={(props) => <DomainDashboard {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/dashboard`}
                     render={(props) => <DomainDashboard {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/users`}
                     render={(props) => <DomainUsers {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/users/:username`}
                     render={(props) => <EditDomainUser {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/users/:username/set-password`}
                     render={(props) => <SetDomainUserPassword {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/create-user`}
                     render={(props) => <CreateDomainUser {...props} domainId={domainId}/>}/>

              <Route exact path={`${match.url}/groups`}
                     render={(props) => <DomainUserGroups {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/groups/:id`}
                     render={(props) => <EditDomainUserGroup {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/create-group`}
                     render={(props) => <CreateDomainUserGroup {...props} domainId={domainId}/>}/>

              <Route exact path={`${match.url}/sessions`}
                     render={(props) => <DomainSessions {...props} domainId={domainId}/>}/>

              <Route exact path={`${match.url}/collections`}
                     render={(props) => <DomainCollections {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/collections/:id`}
                     render={(props) => <EditDomainCollection {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/create-collection`}
                     render={(props) => <CreateDomainCollection {...props} domainId={domainId}/>}/>

              <Route exact path={`${match.url}/models`}
                     render={(props) => <DomainModels {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/models/:id`}
                     render={(props) => <EditDomainModel {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/models/:id/:tab`}
                     render={(props) => <EditDomainModel {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/create-model`}
                     render={(props) => <CreateDomainModel {...props} domainId={domainId}/>}/>

              <Route exact path={`${match.url}/chats`}
                     render={(props) => <DomainChats {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/chats/:id`}
                     render={(props) => <ViewChat {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/chats/:id/edit`}
                     render={(props) => <EditDomainChat {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/create-chat`}
                     render={(props) => <CreateDomainChat {...props} domainId={domainId}/>}/>

              <Route exact path={`${match.url}/authentication/:tab/`}
                     render={(props) => <DomainAuthentication {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/authentication/`}
                     render={(props) => <DomainAuthentication {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/authentication/jwt/create-jwt-key`}
                     render={(props) => <CreateDomainJwtKey {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/authentication/jwt/:id`}
                     render={(props) => <EditDomainJwtKey {...props} domainId={domainId}/>}/>

              <Route exact path={`${match.url}/settings`}
                     render={(props) => <DomainSettings {...props} domainId={domainId}/>}/>
              <Route exact path={`${match.url}/settings/:tab`}
                     render={(props) => <DomainSettings {...props} domainId={domainId}/>}/>

              <Route component={PageNotFound}/>
            </Switch>
          </NavLayout>
          </React.Fragment>
      );
    }
  }

  private _extractNamespaceAndDomain(): DomainId {
    if (this.props.configStore.namespacesEnabled) {
      const {namespace, domainId} = this.props.match.params;
      return new DomainId(namespace, domainId);
    } else {
      const {domainId} = this.props.match.params;
      return new DomainId(this.props.configStore.defaultNamespace, domainId);
    }
  }
}

const INJECTIONS = [SERVICES.DOMAIN_SERVICE, STORES.ACTIVE_DOMAIN_STORE, STORES.BREADCRUMBS_STORE, STORES.CONFIG_STORE];
export const DomainContainer = injectObserver<RouteComponentProps>(INJECTIONS, DomainContainerComponent);
