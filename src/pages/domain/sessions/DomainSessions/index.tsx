import React, {ReactNode} from "react";
import {Page} from "../../../../components/common/Page/";
import {Card, Table, Icon, Switch} from "antd";
import {RouteComponentProps} from "react-router";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {formatDomainUserId, longDateTime, shortDateTime} from "../../../../utils/format-utils";
import {DomainSession} from "../../../../models/domain/DomainSession";
import {DomainSessionFilter, DomainSessionService} from "../../../../services/domain/DomainSessionService";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainId} from "../../../../models/DomainId";
import {DomainUserId} from "../../../../models/domain/DomainUserId";
import {SessionTableControls, SessionTableFilters} from "../../../../components/domain/session/SessionTableControls";
import {SERVICES} from "../../../../services/ServiceConstants";
import {injectAs} from "../../../../utils/mobx-utils";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar";
import styles from "./styles.module.css";

export interface DomainSessionsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainSessionsProps {
  domainSessionService: DomainSessionService;
}

export interface DomainSessionsState {
  loading: boolean;
  sessions: DomainSession[] | null;
  filter: DomainSessionFilter;
}

class DomainSessionsComponent extends React.Component<InjectedProps, DomainSessionsState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private readonly _sessionColumns: any[];
  private _sessionsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [{title: "Sessions"}]);

    this.state = {
      sessions: [],
      loading: false,
      filter: {
        excludeDisconnected: true,
        sessionType: "ExcludeConvergence"
      }
    };

    this._sessionColumns = [{
      title: 'Session Id',
      dataIndex: 'id',
      sorter: true,
    }, {
      title: 'User',
      dataIndex: 'userId',
      sorter: true,
      render: (val: DomainUserId, record: DomainSession) => formatDomainUserId(val),
    }, {
      title: 'Auth Method',
      dataIndex: 'authMethod'
    }, {
      title: 'Connected At',
      dataIndex: 'connected',
      render: (val: Date, record: DomainSession) => val ? shortDateTime(val) : "",
      sorter: (a: DomainSession, b: DomainSession) => a.connected.getTime() - b.connected.getTime()
    }, {
      title: 'Disconnected At',
      dataIndex: 'disconnected',
      render: (val: Date, record: DomainSession) => val ? shortDateTime(val) : ""
    }, {
      title: 'Remote Host',
      dataIndex: 'remoteHost',
    }];

    this._sessionsSubscription = null;
    this._loadSessions();
  }

  public render(): ReactNode {
    if (this.state.sessions !== null) {
      return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={this._renderToolbar()}>
            <SessionTableControls onFilter={this._onFilter}/>
            <Table columns={this._sessionColumns}
                   size="middle"
                   rowKey="id"
                   bordered={true}
                   loading={this.state.loading}
                   dataSource={this.state.sessions}
                   expandedRowRender={this._expander}
            />
          </Card>
        </Page>
      );
    } else {
      return null;
    }
  }

  private _renderToolbar = () => {
    return <CardTitleToolbar icon="cloud" title="Sessions">
      <div className={styles.titleTools}>
        <span>Disconnected Sessions:</span><Switch onChange={this._onChangeDisconnected}/>
        <span>Convergence Users:</span><Switch onChange={this._onChangeConvergenceUsers}/>
      </div>
    </CardTitleToolbar>

  }

  private _expander = (session: DomainSession, index: number, indent: number, expanded: boolean) => {
    return (
      <div className={styles.expander}>
        <table>
          <tbody>
          <tr>
            <td>Session Id:</td>
            <td>{session.id}</td>
          </tr>
          <tr>
            <td>Username:</td>
            <td>{session.userId.username}</td>
          </tr>
          <tr>
            <td>User Type:</td>
            <td>{session.userId.type}</td>
          </tr>
          <tr>
            <td>Auth Method:</td>
            <td>{session.authMethod}</td>
          </tr>
          <tr>
            <td>Connected At:</td>
            <td>{longDateTime(session.connected)}</td>
          </tr>
          <tr>
            <td>Disconnected At:</td>
            <td>{session.disconnected ? longDateTime(session.disconnected) : ""}</td>
          </tr>
          <tr>
            <td>Remote Host:</td>
            <td>{session.remoteHost}</td>
          </tr>
          <tr>
            <td>Client:</td>
            <td>{session.client}</td>
          </tr>
          <tr>
            <td>Client Version:</td>
            <td>{session.clientVersion}</td>
          </tr>
          <tr>
            <td>Client Meta Data:</td>
            <td>{session.clientMetaData}</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }

  private _onChangeDisconnected = (showDisconnected: any) => {
    const filter: DomainSessionFilter = {...this.state.filter, excludeDisconnected: !showDisconnected}
    this.setState({filter}, () => this._loadSessions());
  }

  private _onChangeConvergenceUsers = (showConvergenceUsers: boolean) => {
    const sessionType = showConvergenceUsers ? "all" : "ExcludeConvergence";
    const filter: DomainSessionFilter = {...this.state.filter, sessionType}
    this.setState({filter}, () => this._loadSessions());
  }

  private _onFilter = (filters: SessionTableFilters) => {
    const filter: DomainSessionFilter = {...this.state.filter, ...filters};
    this.setState({filter}, () => this._loadSessions());
  }

  private _loadSessions = () => {
    const {promise, subscription} = makeCancelable(this.props.domainSessionService.getSessions(this.props.domainId, this.state.filter));
    this._sessionsSubscription = subscription;
    promise.then(sessions => {
      this._sessionsSubscription = null;
      this.setState({sessions});
    }).catch(err => {
      this._sessionsSubscription = null;
      this.setState({sessions: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_SESSION_SERVICE];
export const DomainSessions = injectAs<DomainSessionsProps>(injections, DomainSessionsComponent);
