/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import * as React from 'react';
import {ReactNode} from 'react';
import {Route, RouteComponentProps, Switch} from 'react-router';
import {DomainSideNavigation} from "../../components/";
import {DomainDashboard} from "../../pages/domain/Dashboard/";
import {DomainDescriptor} from "../../models/DomainDescriptor";
import {DomainService} from "../../services/DomainService";
import {NavLayout} from "../../components/common/NavLayout";
import {DomainCollections} from "../../pages/domain/collections/DomainCollections";
import {CreateDomainCollection} from "../../pages/domain/collections/CreateDomainCollection";
import {EditDomainCollection} from "../../pages/domain/collections/EditDomainCollection";
import {DomainModels} from "../../pages/domain/models/DomainModels";
import {CreateDomainModel} from "../../pages/domain/models/CreateDomainModel";
import {EditDomainModel} from "../../pages/domain/models/EditDomainModel";
import {injectAs} from "../../utils/mobx-utils";
import {ConvergenceDomainStore} from "../../stores/ConvergenceDomainStore";
import {DomainId} from "../../models/DomainId";
import {SERVICES} from "../../services/ServiceConstants";
import {STORES} from "../../stores/StoreConstants";
import {ConvergenceDomain} from "@convergence/convergence";
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
import {RestError} from "../../services/RestError";
import {DomainStatus} from "../../models/DomainStatus";
import {DomainLoading} from "../../components/domain/common/DomainLoading";
import {ErrorPage} from "../../components/common/ErrorPage";
import {DomainInitializing} from "../../components/domain/common/DomainInitializing";
import {BreadcrumbsStore} from "../../stores/BreacrumsStore";
import {ConfigStore} from "../../stores/ConfigStore";

export interface DomainRouteParams {
  namespace: string;
  domainId: string;
}

interface DomainContainerProps extends RouteComponentProps<DomainRouteParams> {
  domainService: DomainService;
  convergenceDomainStore: ConvergenceDomainStore;
  breadcrumbsStore: BreadcrumbsStore;
  configStore: ConfigStore;
}

interface DomainContainerState {
  domainData: DomainDescriptor | null;
  convergenceDomain: ConvergenceDomain | null;
  error: string | null;
}

export class DomainContainerComponent extends React.Component<DomainContainerProps, DomainContainerState> {
  private _reloadTask: any = null;

  constructor(props: DomainContainerProps) {
    super(props);

    this.state = {
      domainData: null,
      convergenceDomain: null,
      error: ""
    };
  }

  public componentDidMount() {
    const domainId = this._extractNamespaceAndDomain();
    this.props.breadcrumbsStore.setDomain(domainId);
    this._loadDomain(domainId);
  }

  public componentWillUnmount() {
    this.props.convergenceDomainStore.disconnect();
    this.props.breadcrumbsStore.setDomain(null);
  }

  public componentDidUpdate(prevProps: Readonly<DomainContainerProps>, prevState: Readonly<DomainContainerState>): void {
    if (this.state.domainData === null) {
      return;
    }

    const domainId = this._extractNamespaceAndDomain();
    if (this.state.domainData!.namespace !== domainId.namespace ||
      this.state.domainData!.id !== domainId.id) {
      this._loadDomain(domainId);
    }
  }

  public render(): ReactNode {
    const {match} = this.props;
    const {domainData, convergenceDomain, error} = this.state;

    if (error !== null) {
      return (<ErrorPage title="Error Loading Domain" message={error} />);
    } else if (domainData === null) {
      return <DomainLoading/>;
    } else if (domainData!.status === DomainStatus.INITIALIZING) {
      return <DomainInitializing/>;
    } else if (domainData!.status === DomainStatus.DELETING) {
      return (<ErrorPage title="Domain Deleting" message="This domain can not be used because is being deleted." />);
    } else if (convergenceDomain === null) {
      return <DomainLoading/>;
    } else {
      const domainId = domainData!.toDomainId();
      return (
        <NavLayout sideNav={<DomainSideNavigation domainId={domainId}/>}>
          <Switch>
            <Route exact path={`${match.url}/`} render={(props) => <DomainDashboard {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/dashboard`} render={(props) => <DomainDashboard {...props} domainId={domainId}/>}/>

            <Route exact path={`${match.url}/users`} render={(props) => <DomainUsers {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/users/:username`} render={(props) => <EditDomainUser {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/users/:username/set-password`} render={(props) => <SetDomainUserPassword {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/create-user`} render={(props) => <CreateDomainUser {...props} domainId={domainId}/>}/>

            <Route exact path={`${match.url}/groups`} render={(props) => <DomainUserGroups {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/groups/:id`} render={(props) => <EditDomainUserGroup {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/create-group`} render={(props) => <CreateDomainUserGroup {...props} domainId={domainId}/>}/>

            <Route exact path={`${match.url}/sessions`} render={(props) => <DomainSessions {...props} domainId={domainId}/>}/>

            <Route exact path={`${match.url}/collections`} render={(props) => <DomainCollections {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/collections/:id`} render={(props) => <EditDomainCollection {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/create-collection`} render={(props) => <CreateDomainCollection {...props} domainId={domainId}/>}/>

            <Route exact path={`${match.url}/models`} render={(props) => <DomainModels {...props} domainId={domainId}/>} />
            <Route exact path={`${match.url}/models/:id`} render={(props) => <EditDomainModel {...props} domainId={domainId}/>} />
            <Route exact path={`${match.url}/models/:id/:tab`} render={(props) => <EditDomainModel {...props} domainId={domainId}/>} />
            <Route exact path={`${match.url}/create-model`} render={(props) => <CreateDomainModel {...props} domainId={domainId}/>} />

            <Route exact path={`${match.url}/chats`} render={(props) => <DomainChats {...props} domainId={domainId}/>} />
            <Route exact path={`${match.url}/chats/:id`} render={(props) => <EditDomainChat {...props} domainId={domainId}/>} />
            <Route exact path={`${match.url}/create-chat`} render={(props) => <CreateDomainChat {...props} domainId={domainId}/>} />

            <Route exact path={`${match.url}/authentication/:tab/`} render={(props) => <DomainAuthentication {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/authentication/`} render={(props) => <DomainAuthentication {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/authentication/jwt/create-jwt-key`} render={(props) => <CreateDomainJwtKey {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/authentication/jwt/:id`} render={(props) => <EditDomainJwtKey {...props} domainId={domainId}/>}/>

            <Route exact path={`${match.url}/settings`} render={(props) => <DomainSettings {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/settings/:tab`} render={(props) => <DomainSettings {...props} domainId={domainId}/>}/>

            <Route component={PageNotFound}/>
          </Switch>
        </NavLayout>
      );
    }
  }

  private _loadDomain = (domainId: DomainId) => {
    this.setState({domainData: null, convergenceDomain: null, error: null});

    this.props.domainService
      .getDomain(domainId)
      .then(domainData => {
        this.setState({domainData});

        if (domainData.status === DomainStatus.INITIALIZING) {
          if (this._reloadTask !== null) {
            clearTimeout(this._reloadTask);
          }
          this._reloadTask = setTimeout(() => this._loadDomain(domainId), 5000);
        } else if (domainData.status !== DomainStatus.DELETING) {
          return this.props.convergenceDomainStore.activateDomain(domainId)
            .then(() => {
              this.setState({convergenceDomain: this.props.convergenceDomainStore.domain});
            });
        }
      })
      .catch(err => {
        let error = "Unknown error loading domain.";

        if (err instanceof RestError) {
          if (err.code === "not_found") {
            error = `The domain '${domainId.namespace}/${domainId.id}' does not exist!`;
          } else {
            console.error(err);
          }
        } else {
          console.error(err);
        }

        this.setState({
          domainData: null,
          convergenceDomain: null,
          error
        });
      });
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

const INJECTIONS = [SERVICES.DOMAIN_SERVICE, STORES.CONVERGENCE_DOMAIN_STORE, STORES.BREADCRUMBS_STORE, STORES.CONFIG_STORE];
export const DomainContainer = injectAs<RouteComponentProps>(INJECTIONS, DomainContainerComponent);
