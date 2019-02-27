import * as React from 'react';
import {Page} from "../../../../components/common/Page/";
import {KeyboardEvent, ReactNode} from "react";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, notification, Popconfirm, Table} from "antd";
import styles from "./styles.module.css";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {ConvergenceUser} from "../../../../models/ConvergenceUser";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {DomainId} from "../../../../models/DomainId";
import {DomainUserService} from "../../../../services/domain/DomainUserService";
import {DomainUser} from "../../../../models/domain/DomainUser";
import {toDomainUrl} from "../../../../utils/domain-url";
import {shortDateTime} from "../../../../utils/format-utils";

export interface DomainUsersProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainUsersProps {
  domainUserService: DomainUserService;
}

export interface DomainUsersState {
  users: DomainUser[] | null;
  userFilter: string;
}

export class DomainUsersComponent extends React.Component<InjectedProps, DomainUsersState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private readonly _userTableColumns: any[];
  private _usersSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [{title: "Users"}]);

    this._userTableColumns = [{
      title: 'Username',
      dataIndex: 'username',
      sorter: (a: any, b: any) => (a.username as string).localeCompare(b.username),
      render: (text: string) => <Link to={toDomainUrl("", this.props.domainId,`users/${text}`)}>{text}</Link>
    }, {
      title: 'Display Name',
      dataIndex: 'displayName',
      sorter: (a: any, b: any) => (a.displayName as string).localeCompare(b.displayName)
    }, {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a: any, b: any) => (a.email as string).localeCompare(b.email)
    }, {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      align: 'left',
      render: (value: any, record: any) => record.lastLogin ? shortDateTime(record.lastLogin) : "Never"
    }, {
      title: 'Status',
      dataIndex: 'disabled',
      render: (disabled: boolean, record: DomainUser) => disabled ? "Disabled" : "Enabled"
    }, {
      title: '',
      align: 'right',
      render: this._renderActions
    }];

    this._usersSubscription = null;

    this.state = {
      users: null,
      userFilter: ""
    };

    this._loadUsers();
  }

  public componentWillUnmount(): void {
    if (this._usersSubscription) {
      this._usersSubscription.unsubscribe();
      this._usersSubscription = null;
    }
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Users" icon="user">
        <span className={styles.search}>
          <Input placeholder="Search Users" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <Tooltip placement="topRight" title="Create User" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <Icon type="plus-circle"/>
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Reload Users" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._loadUsers}>
            <Icon type="reload"/>
          </Button>
        </Tooltip>
      </CardTitleToolbar>
    )
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({userFilter: (event.target as HTMLInputElement).value}, this._loadUsers);
  }

  private _goToCreate = () => {
    const url = toDomainUrl("", this.props.domainId, "create-user");
    this.props.history.push(url);
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 size="middle"
                 rowKey="username"
                 columns={this._userTableColumns}
                 dataSource={this.state.users || []}
          />
        </Card>
      </Page>
    );
  }

  private _renderActions = (value: ConvergenceUser, record: any) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit User" mouseEnterDelay={1}>
          <Link to={toDomainUrl("", this.props.domainId, `users/${value.username}`)}>
            <Button shape="circle" size="small" htmlType="button" icon="edit"/>
          </Link>
        </Tooltip>
        <Tooltip placement="topRight" title="Set Password" mouseEnterDelay={1}>
          <Link to={toDomainUrl("", this.props.domainId, `users/${value.username}/set-password`)}>
            <Button shape="circle" size="small" htmlType="button" icon="lock"/>
          </Link>
        </Tooltip>
        <Popconfirm title="Are you sure delete this user?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteUser(record.username)}
                    okText="Yes"
                    cancelText="No"
                    icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
        >
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button" icon="delete"/>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _onDeleteUser = (username: string) => {
    this.props.domainUserService.deleteUser(this.props.domainId, username)
      .then(() => {
        this._loadUsers();
        notification.success({
          message: 'User Deleted',
          description: `The user '${username}' was deleted.`,
        });
      })
      .catch(err => {
        console.error(err);
        notification.error({
          message: 'Could Not Delete User',
          description: `The user could not be deleted.`,
        });
      });
  }

  private _loadUsers = () => {
    const filter = this.state.userFilter !== "" ? this.state.userFilter : undefined;
    const {promise, subscription} = makeCancelable(this.props.domainUserService.getUsers(this.props.domainId, filter));
    this._usersSubscription = subscription;
    promise.then(users => {
      this._usersSubscription = null;
      this.setState({users});
    }).catch(err => {
      this._usersSubscription = null;
      this.setState({users: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_USER_SERVICE];
export const DomainUsers = injectAs<DomainUsersProps>(injections, DomainUsersComponent);

