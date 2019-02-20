import * as React from 'react';
import {Component, ReactNode} from "react";
import styles from "./styles.module.css";
import {Button, Icon, Popconfirm, Select, Table} from "antd";
import Tooltip from "antd/es/tooltip";

const {Option} = Select;

export interface UserRole {
  username: string;
  role: string;
}

interface UserRoleTableProps {
  userRoles: Map<string, string>;
  roles: string[];
  onChangeRole(username: string, role: string): void;
  onRemoveUser(username: string): void;
}

export class UserRoleTable extends Component<UserRoleTableProps,{}> {

  private readonly _userRoleTableColumns: any[];

  constructor(props: UserRoleTableProps) {
    super(props);

    this._userRoleTableColumns = [{
      title: 'Username',
      dataIndex: 'username',
      sorter: (a: any, b: any) => (a.username as string).localeCompare(b.username),
    }, {
      title: 'Role',
      dataIndex: 'role',
      width: "200px",
      sorter: (a: any, b: any) => (a.role as string).localeCompare(b.role),
      render: this._renderRole
    }, {
      title: '',
      dataIndex: 'a',
      align: 'right',
      width: "50px",
      render: this._renderActions
    }];

  }

  public render(): ReactNode {
    const userRoles: UserRole[] = [];
    this.props.userRoles.forEach((role, username) => userRoles.push({username, role}));
    return (
      <Table className={styles.userTable}
             rowKey="username"
             size="middle"
             columns={this._userRoleTableColumns}
             dataSource={userRoles || []}
      />
    )
  }

  private _renderActions = (text: any, record: any) => {
    const {username} = record;
    return (
      <span className={styles.actions}>
        <Popconfirm title="Are you sure delete this user?"
                    placement="topRight"
                    onConfirm={() => {this.props.onRemoveUser(username)}}
                    okText="Yes"
                    cancelText="No"
                    icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}>
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={1}>
          <Button shape="circle" size="small" htmlType="button"><Icon type="delete"/></Button>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  };

  private _renderRole = (text: any, record: any) => {
    const {username} = record;
    return (
      <Select style={{width: "100%"}}
              defaultValue={text}
              onChange={(role, option) => this.props.onChangeRole(username, role)}>
        {this.props.roles.map(role => <Option key={role}>{role}</Option>)}
      </Select>
    );
  }
}

