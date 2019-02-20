import * as React from 'react';
import {Route, RouteComponentProps, Switch} from 'react-router';
import {DomainSideNavigation} from "../../components/";
import {DomainDashboard} from "../../pages/domain/Dashboard/";
import {DomainDescriptor} from "../../models/DomainDescriptor";
import {ReactNode} from "react";
import {DomainService} from "../../services/DomainService";
import {NavLayout} from "../../components/NavLayout";
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

export interface DomainRouteParams {
  namespace: string;
  domainId: string;
}

interface DomainContainerProps extends RouteComponentProps<DomainRouteParams> {
  domainService: DomainService;
  convergenceDomainStore: ConvergenceDomainStore;
}

interface DomainContainerState {
  domainData: DomainDescriptor | null;
  convergenceDomain: ConvergenceDomain | null;
}

export class DomainContainerComponent extends React.Component<DomainContainerProps, DomainContainerState> {
  constructor(props: DomainContainerProps) {
    super(props);

    this.state = {
      domainData: null,
      convergenceDomain: null
    };
  }

  public componentDidMount() {
    const domainInfo = this._extractNamespaceAndDomain();
    this._loadDomain(domainInfo);
  }

  public componentWillUnmount() {
    this.props.convergenceDomainStore.disconnect();
  }

  public componentDidUpdate(prevProps: Readonly<DomainContainerProps>, prevState: Readonly<DomainContainerState>): void {
    if (this.state.domainData === null) {
      return;
    }

    const domainInfo = this._extractNamespaceAndDomain();
    if (this.state.domainData!.namespace !== domainInfo.namespace ||
      this.state.domainData!.id !== domainInfo.domainId) {
      this._loadDomain(domainInfo);
    }
  }

  public render(): ReactNode {
    const {match} = this.props;
    const {domainData, convergenceDomain} = this.state;

    if (domainData !== null && convergenceDomain !== null) {
      const domainId = domainData.toDomainId();
      return (
        <NavLayout sideNav={<DomainSideNavigation domainId={domainId}/>}>
          <Switch>
            <Route exact path={`${match.url}/`} render={(props) => <DomainDashboard {...props} domainId={domainId}/>}/>
            <Route path={`${match.url}/dashboard`} render={(props) => <DomainDashboard {...props} domainId={domainId}/>}/>

            <Route exact path={`${match.url}/users`} render={(props) => <DomainUsers {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/users/:username`} render={(props) => <EditDomainUser {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/users/:username/set-password`} render={(props) => <SetDomainUserPassword {...props} domainId={domainId}/>}/>
            <Route path={`${match.url}/create-user`} render={(props) => <CreateDomainUser {...props} domainId={domainId}/>}/>

            <Route exact path={`${match.url}/groups`} render={(props) => <DomainUserGroups {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/groups/:id`} render={(props) => <EditDomainUserGroup {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/create-group`} render={(props) => <CreateDomainUserGroup {...props} domainId={domainId}/>}/>

            <Route path={`${match.url}/sessions`} render={(props) => <div>Sessions</div>}/>

            <Route exact path={`${match.url}/collections`} render={(props) => <DomainCollections {...props} domainId={domainId}/>}/>
            <Route exact path={`${match.url}/collections/:id`} render={(props) => <EditDomainCollection {...props} domainId={domainId}/>}/>
            <Route path={`${match.url}/create-collection`} render={(props) => <CreateDomainCollection {...props} domainId={domainId}/>}/>

            <Route exact path={`${match.url}/models`} render={(props) => <DomainModels {...props} domainId={domainId}/>} />
            <Route path={`${match.url}/create-model`} render={(props) => <CreateDomainModel {...props} domainId={domainId}/>} />
            <Route path={`${match.url}/models/:modelId`} render={(props) => <EditDomainModel {...props} domainId={domainId}/>} />

            <Route path={`${match.url}/settings`} render={(props) => <div>Settings</div>}/>
          </Switch>
        </NavLayout>
      );
    } else {
      return null;
    }
  }

  private _loadDomain(domain: { namespace: string, domainId: string }): void {
    this.setState({domainData: null, convergenceDomain: null});

    this.props.domainService
      .getDomain(domain.namespace, domain.domainId)
      .then(domainData => {
        this.setState({ domainData});
      });

    this.props.convergenceDomainStore.
    activateDomain(new DomainId(domain.namespace, domain.domainId))
      .then(() => {
        this.setState({convergenceDomain: this.props.convergenceDomainStore.domain});
      })
  }

  private _extractNamespaceAndDomain(): { namespace: string, domainId: string } {
    const {namespace, domainId} = this.props.match.params;
    return {namespace, domainId};
  }
}

const INJECTIONS = [SERVICES.DOMAIN_SERVICE, STORES.CONVERGENCE_DOMAIN_STORE]
export const DomainContainer = injectAs<RouteComponentProps>(INJECTIONS, DomainContainerComponent);
