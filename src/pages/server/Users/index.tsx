import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, message, Popconfirm, Table, Tag} from "antd";
import styles from "./styles.module.css";
import {CartTitleToolbar} from "../../../components/CardTitleToolbar";
import {RouteComponentProps} from "react-router";


const data = [{
  key: '1',
  username: 'john.brown',
  displayName: "John Brown",
  firstName: "John",
  lastName: "Brown",
  email: "jbrown@example.com",
  lastLogin: "2019-01-22 @ 24:12:00",
  role: "admin"
}, {
  key: '2',
  username: 'tim.white',
  displayName: "Tim White",
  firstName: "Timothy",
  lastName: "White",
  email: "white.tim@example.com",
  lastLogin: "2019-01-11 @ 23:12:00",
  role: "developer"
}];

export class ServerUsers extends React.Component<RouteComponentProps, {}> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([{title: "Users"}]);
  private readonly _userTableColumns: any[];

  constructor(props: RouteComponentProps) {
    super(props);
    this._userTableColumns = [{
      title: 'Username',
      dataIndex: 'username',
      sorter: (a: any, b: any) => (a.username as string).localeCompare(b.username),
      render: (text: string) => <a href="javascript:;">{text}</a>
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
      key: 'lastLogin',
      align: 'left'
    }, {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'left',
      render: (text: any, record: any) => <Tag color="blue">{record.role}</Tag>
    }, {
      title: 'Actions',
      dataIndex: 'operation',
      key: 'operation',
      align: 'right',
      render: this._renderActions
    }];
  }

  private _renderToolbar(): ReactNode {
    return (
      <CartTitleToolbar title="Users" icon="user">
        <span className={styles.search}>
          <Input placeholder="Search Users" addonAfter={<Icon type="search"/>}/>
        </span>
        <Tooltip placement="topRight" title="Create User" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button" onClick={this._goToCreate}>
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

  private _goToCreate = () => {
    this.props.history.push("/users/create");
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <Card title={this._renderToolbar()} >
          <Table className={styles.userTable}
                 rowSelection={{onChange: this.onUserSelectionChanged, getCheckboxProps: this.getCheckboxProps}}
                 size="middle"
                 columns={this._userTableColumns}
                 dataSource={data}
          />
        </Card>
      </Page>
    );
  }

  private _renderActions = (text: any, record: any) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit User" mouseEnterDelay={1}>
          <Button shape="circle" size="small" htmlType="button"><Icon type="edit"/></Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Set Password" mouseEnterDelay={1}>
          <Button shape="circle" size="small" htmlType="button"><Icon type="lock"/></Button>
        </Tooltip>
        <Popconfirm title="Are you sure delete this user?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteUser(record.username)}
                    okText="Yes"
                    cancelText="No"
                    icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}>
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={1}>
          <Button shape="circle" size="small" htmlType="button"><Icon type="delete"/></Button>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _onDeleteUser = (username: string) => {
    message.success(`User '${username}' deleted.`);
  }

  private onUserSelectionChanged = (selectedRowKeys: string[] | number[], selectedRows: any[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }

  private getCheckboxProps = (record: any) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  })
}
