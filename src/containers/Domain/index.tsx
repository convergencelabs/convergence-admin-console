import * as React from 'react';
import {Route, RouteComponentProps, Switch} from 'react-router';
import styles from './style.module.css';
import {DomainSideNavigation} from "../../components/";
import {DomainDashboard} from "../../pages/domain/Dashboard/";
import {Layout} from 'antd';
import {DomainUsers} from "../../pages/domain/Users";
import {DomainDescriptor} from "../../models/DomainDescriptor";
import {ReactNode} from "react";
import {DomainService} from "../../services/DomainService";
import {injectAs} from "../../utils/mobx-utils";
import {NavLayout} from "../../components/NavLayout";

const {Content} = Layout;

interface DomainContainerProps extends RouteComponentProps {
  domainService: DomainService;
}

interface DomainContainerState {
  domain: DomainDescriptor | null;
  loading: boolean;
}

export class DomainContainerComponent extends React.Component<DomainContainerProps, DomainContainerState> {
  constructor(props: DomainContainerProps) {
    super(props);

    this.state = {
      domain: null,
      loading: true
    };
  }

  public componentDidMount() {
    const domainInfo = this._extractNamespaceAndDomain();
    this._loadDomain(domainInfo);
  }

  public componentDidUpdate(prevProps: Readonly<DomainContainerProps>, prevState: Readonly<DomainContainerState>): void {
    if (this.state.domain === null) {
      return;
    }

    const domainInfo = this._extractNamespaceAndDomain();
    if (this.state.domain!.namespace !== domainInfo.namespace ||
      this.state.domain!.id !== domainInfo.domainId) {
      this._loadDomain(domainInfo);
    }
  }
  
  public render(): ReactNode {
    const {match} = this.props;
    const domain = this.state.domain;

    if (domain !== null && domain !== undefined) {
      return (
        <NavLayout sideNav={<DomainSideNavigation/>}>
          <Switch>
            <Route exact path={`${match.url}/`} render={(props) => <DomainDashboard {...props} domain={domain}/>}/>
            <Route path={`${match.url}/dashboard`} render={(props) => <DomainDashboard {...props} domain={domain}/>}/>
            <Route path={`${match.url}/users`} render={(props) => <DomainUsers {...props} domain={domain}/>}/>
            <Route path={`${match.url}/groups`} render={(props) => <div>Groups</div>}/>
            <Route path={`${match.url}/sessions`} render={(props) => <div>sessions</div>}/>
            <Route path={`${match.url}/collections`} render={(props) => <div>Collections</div>}/>
            <Route path={`${match.url}/models`} render={(props) => <div>Models</div>}/>
            <Route path={`${match.url}/settings`} render={(props) => <div>Settings</div>}/>
          </Switch>
        </NavLayout>
      );
    } else {
      return (<div></div>);
    }
  }

  private _loadDomain(domain: { namespace: string, domainId: string }): void {
    this.setState({domain: null, loading: true});

    this.props.domainService
      .getDomain(domain.namespace, domain.domainId)
      .then(domain => {
        this.setState({loading: false, domain});
      })
  }

  private _extractNamespaceAndDomain(): { namespace: string, domainId: string } {
    const {namespace, domainId} = (this.props.match.params as any);
    return {namespace, domainId};
  }
}

export const DomainContainer = injectAs<RouteComponentProps>(["domainService"], DomainContainerComponent);
