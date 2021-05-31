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
import {KeyboardEvent, ReactNode} from 'react';
import {Page} from "../../../../components/common/Page/";
import Tooltip from "antd/es/tooltip";
import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, notification, Popconfirm, Table } from "antd";
import styles from "./styles.module.css";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {ConvergenceUser} from "../../../../models/ConvergenceUser";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainId} from "../../../../models/DomainId";
import {DomainUserService} from "../../../../services/domain/DomainUserService";
import {DomainUser} from "../../../../models/domain/DomainUser";
import {toDomainRoute} from "../../../../utils/domain-url";
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
  private readonly _breadcrumbs = [{title: "Users"}];
  private readonly _userTableColumns: any[];
  private _usersSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._userTableColumns = [{
      title: 'Username',
      dataIndex: 'username',
      sorter: (a: DomainUser, b: DomainUser) => (a.username as string).localeCompare(b.username),
      render: (username: string) => <Link to={toDomainRoute(this.props.domainId, `users/${username}`)}>{username}</Link>
    }, {
      title: 'Display Name',
      dataIndex: 'displayName',
      sorter: (a: DomainUser, b: DomainUser) => (a.displayName as string).localeCompare(b.displayName)
    }, {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a: DomainUser, b: DomainUser) => (a.email as string).localeCompare(b.email)
    }, {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      align: 'left',
      render: (lastLogin: Date) => lastLogin ? shortDateTime(lastLogin) : "Never"
    }, {
      title: 'Status',
      dataIndex: 'disabled',
      render: (disabled: boolean) => disabled ? "Disabled" : "Enabled"
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
          <Input placeholder="Search Users" addonAfter={<SearchOutlined />} onKeyUp={this._onFilterChange}/>
        </span>
        <Tooltip placement="topRight" title="Create User" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <PlusCircleOutlined />
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Reload Users" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._loadUsers}>
            <ReloadOutlined />
          </Button>
        </Tooltip>
      </CardTitleToolbar>
    );
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({userFilter: (event.target as HTMLInputElement).value}, this._loadUsers);
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-user");
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
          <Link to={toDomainRoute(this.props.domainId, `users/${value.username}`)}>
            <Button shape="circle" size="small" htmlType="button" icon={<EditOutlined />}/>
          </Link>
        </Tooltip>
        <Tooltip placement="topRight" title="Set Password" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `users/${value.username}/set-password`)}>
            <Button shape="circle" size="small" htmlType="button" icon={<LockOutlined />}/>
          </Link>
        </Tooltip>
        <Popconfirm title="Are you sure delete this user?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteUser(record.username)}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{color: 'red'}} />}
        >
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button" icon={<DeleteOutlined />}/>
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

