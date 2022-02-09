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

import React, {KeyboardEvent, ReactNode} from 'react';
import {Page} from "../../../../components";
import Tooltip from "antd/es/tooltip";

import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined, UserOutlined,
} from '@ant-design/icons';

import { Button, Card, Input, message, notification, Popconfirm, Table, Tag } from "antd";
import styles from "./styles.module.css";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {UserService} from "../../../../services/UserService";
import {ConvergenceUser} from "../../../../models/ConvergenceUser";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import moment from "moment";
import {STORES} from "../../../../stores/StoreConstants";
import {loggedInUserStore, LoggedInUserStore} from "../../../../stores/LoggedInUserStore";
import {Link} from "react-router-dom";

interface InjectedProps extends RouteComponentProps {
  userService: UserService;
  loggedInUserStore: LoggedInUserStore;
}

export interface ServerUsersState {
  users: ConvergenceUser[] | null;
  userFilter: string;
}

class ServerUsersComponent extends React.Component<InjectedProps, ServerUsersState> {
  private readonly _breadcrumbs = [{title: "Convergence Users"}];
  private readonly _userTableColumns: any[];
  private _usersSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._userTableColumns = [{
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a: any, b: any) => (a.username as string).localeCompare(b.username),
      render: (text: string) => {
        if (loggedInUserStore.isServerAdmin()) {
          return (<Link to={`/users/${text}`}>{text}</Link>);
        } else {
          return text;
        }
      }
    }, {
      title: 'Display Name',
      dataIndex: 'displayName',
      key: "displayName",
      sorter: (a: any, b: any) => (a.displayName as string).localeCompare(b.displayName)
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: any, b: any) => (a.email as string).localeCompare(b.email)
    }, {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      align: 'left',
      render: (value: any, record: any) => record.lastLogin ? moment(record.lastLogin).format("MM/DD @ hh:mm:a") : "Never"
    }, {
      title: 'Role',
      dataIndex: 'serverRole',
      key: 'serverRole',
      align: 'left',
      render: (value: any, _: any) => <Tag color="blue">{value}</Tag>
    }, {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: this._renderActions
    }];

    this._usersSubscription = null;

    // here we remove some columns if the user does not have the server admin role.
    if (!loggedInUserStore.isServerAdmin()) {
      const emailIndex = this._userTableColumns.findIndex(k => k.key === "email");
      this._userTableColumns.splice(emailIndex, 1);

      const loginIndex = this._userTableColumns.findIndex(k => k.key === "lastLogin");
      this._userTableColumns.splice(loginIndex, 1);

      const actionsIndex = this._userTableColumns.findIndex(k => k.key === "actions");
      this._userTableColumns.splice(actionsIndex, 1);
    }

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
      <CardTitleToolbar title="Users" icon={<UserOutlined />}>
        <span className={styles.search}>
          <Input placeholder="Search Users" addonAfter={<SearchOutlined />} onKeyUp={this._onFilterChange}/>
        </span>
        {
          loggedInUserStore.isServerAdmin() ?
          <Tooltip placement="topRight" title="Create User" mouseEnterDelay={1}>
            <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                    onClick={this._goToCreate}>
              <PlusCircleOutlined />
            </Button>
          </Tooltip>
            :
            null
        }
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
    this.props.history.push("/create-user");
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
    const profile = this.props.loggedInUserStore.loggedInUser;
    const deleteDisabled = profile!.username === record.username;
    const deleteButton = <Button shape="circle" size="small" htmlType="button" disabled={deleteDisabled}><DeleteOutlined /></Button>;

    const deleteComponent = deleteDisabled ?
      <Tooltip placement="topRight" title="You can not delete yourself!" mouseEnterDelay={1}>
        {deleteButton}
      </Tooltip> :
      <Popconfirm title="Are you sure you want to delete this user?"
                  placement="topRight"
                  onConfirm={() => this._onDeleteUser(record.username)}
                  okText="Yes"
                  cancelText="No"
                  icon={<QuestionCircleOutlined style={{color: 'red'}} />}
      >
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={2}>
          {deleteButton}
        </Tooltip>
      </Popconfirm>

    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit User" mouseEnterDelay={1}>
          <Link to={`/users/${value.username}`}>
            <Button shape="circle" size="small" htmlType="button" icon={<EditOutlined />}/>
          </Link>
        </Tooltip>
        <Tooltip placement="topRight" title="Set Password" mouseEnterDelay={1}>
          <Link to={`/users/${value.username}/set-password`}>
            <Button shape="circle" size="small" htmlType="button" icon={<LockOutlined />}/>
          </Link>
        </Tooltip>
        {deleteComponent}
    </span>
    );
  }

  private _onDeleteUser = (username: string) => {
    this.props.userService.deleteUser(username)
      .then(() => {
        this._loadUsers();
        message.success(`User '${username}' deleted.`);
      })
      .catch(() => {
        notification.error({
          message: 'Could Not Delete User',
          description: `The user could not be deleted.`,
        });
      });
  }

  private _loadUsers = () => {
    const filter = this.state.userFilter !== "" ? this.state.userFilter : undefined;
    const {promise, subscription} = makeCancelable(this.props.userService.getUsers(filter));
    this._usersSubscription = subscription;
    promise.then(users => {
      this._usersSubscription = null;
      this.setState({users});
    }).catch(() => {
      this._usersSubscription = null;
      this.setState({users: null});
    });
  }
}

const injections = [SERVICES.USER_SERVICE, STORES.PROFILE_STORE];
export const ServerUsers = injectAs<RouteComponentProps>(injections, ServerUsersComponent);
