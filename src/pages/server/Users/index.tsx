import * as React from 'react';
import {Page} from "../../../components/Page/";
import {KeyboardEvent, ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, message, notification, Popconfirm, Table, Tag} from "antd";
import styles from "./styles.module.css";
import {CartTitleToolbar} from "../../../components/CardTitleToolbar";
import {RouteComponentProps} from "react-router";
import {UserService} from "../../../services/UserService";
import {ConvergenceUserInfo} from "../../../models/ConvergenceUserInfo";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import moment from "moment";
import {STORES} from "../../../stores/StoreConstants";
import {ProfileStore} from "../../../stores/ProfileStore";


interface InjectedProps extends RouteComponentProps {
  userService: UserService;
  profileStore: ProfileStore;
}

interface ServerUsersState {
  users: ConvergenceUserInfo[] | null;
  userFilter: string;
}

export class ServerUsersComponent extends React.Component<InjectedProps, ServerUsersState> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([{title: "Users"}]);
  private readonly _userTableColumns: any[];
  private _usersSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._userTableColumns = [{
      title: 'Username',
      dataIndex: 'user.username',
      key: 'username',
      sorter: (a: any, b: any) => (a.username as string).localeCompare(b.username),
      render: (text: string) => <a href="javascript:;">{text}</a>
    }, {
      title: 'Display Name',
      dataIndex: 'user.displayName',
      key: "displayName",
      sorter: (a: any, b: any) => (a.displayName as string).localeCompare(b.displayName)
    }, {
      title: 'Email',
      dataIndex: 'user.email',
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
      dataIndex: 'globalRole',
      key: 'globalRole',
      align: 'left',
      render: (value: any, record: any) => <Tag color="blue">{value}</Tag>
    }, {
      title: 'Actions',
      key: 'actions',
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
    }
  }

  private _renderToolbar(): ReactNode {
    return (
      <CartTitleToolbar title="Users" icon="user">
        <span className={styles.search}>
          <Input placeholder="Search Users" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <Tooltip placement="topRight" title="Create User" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <Icon type="plus-circle"/>
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Delete Users" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button">
            <Icon type="delete"/>
          </Button>
        </Tooltip>
      </CartTitleToolbar>
    )
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({userFilter: (event.target as HTMLInputElement).value}, this._loadUsers);
  }

  private _goToCreate = () => {
    this.props.history.push("/users/create");
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 rowSelection={{onChange: this.onUserSelectionChanged, getCheckboxProps: this.getCheckboxProps}}
                 size="middle"
                 rowKey="user.username"
                 columns={this._userTableColumns}
                 dataSource={this.state.users || []}
          />
        </Card>
      </Page>
    );
  }

  private _renderActions = (text: any, record: any) => {
    const profile = this.props.profileStore.profile;
    const deleteDisabled = profile!.username === record.user.username;
    const deleteButton = <Button shape="circle" size="small" htmlType="button" disabled={deleteDisabled}><Icon
      type="delete"/></Button>;

    const deleteComponent = deleteDisabled ?
      <Tooltip placement="topRight" title="You can not delete yourself!" mouseEnterDelay={1}>
        {deleteButton}
      </Tooltip> :
      <Popconfirm title="Are you sure delete this user?"
                  placement="topRight"
                  onConfirm={() => this._onDeleteUser(record.user.username)}
                  okText="Yes"
                  cancelText="No"
                  icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
      >
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={2}>
          {deleteButton}
        </Tooltip>
      </Popconfirm>

    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit User" mouseEnterDelay={1}>
          <Button shape="circle" size="small" htmlType="button"><Icon type="edit"/></Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Set Password" mouseEnterDelay={1}>
          <Button shape="circle" size="small" htmlType="button"><Icon type="lock"/></Button>
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
      .catch(err => {
        notification["error"]({
          message: 'Could Not Delete User',
          description: `The user could not be deleted.`,
          placement: "bottomRight"
        });
      });
  }

  private onUserSelectionChanged = (selectedRowKeys: string[] | number[], selectedRows: any[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }

  private getCheckboxProps = (record: any) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  })

  private _loadUsers(): void {
    const filter = this.state.userFilter !== "" ? this.state.userFilter : undefined;
    const {promise, subscription} = makeCancelable(this.props.userService.getUserInfo(filter));
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


export const ServerUsers = injectAs<RouteComponentProps>([SERVICES.USER_SERVICE, STORES.PROFILE_STORE], ServerUsersComponent);

