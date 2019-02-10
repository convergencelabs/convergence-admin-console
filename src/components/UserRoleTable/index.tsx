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
  userRoles: UserRole[]
}

export class UserRoleTable extends Component<UserRoleTableProps,{}> {

  private readonly _userRoleTableColumns: any[];

  constructor(props: UserRoleTableProps) {
    super(props);

    this._userRoleTableColumns = [{
      title: 'Username',
      dataIndex: 'username',
      sorter: (a: any, b: any) => (a.id as string).localeCompare(b.id),
    }, {
      title: 'Role',
      dataIndex: 'role',
      width: "200px",
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
    return (
      <Table className={styles.userTable}
             rowKey="username"
             size="middle"
             columns={this._userRoleTableColumns}
             dataSource={this.props.userRoles || []}
      />
    )
  }


  private _renderActions = (text: any, record: any) => {
    return (
      <span className={styles.actions}>
        <Popconfirm title="Are you sure delete this user?"
                    placement="topRight"
                    onConfirm={() => {}}
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


  private _renderRole = (text: any, record: any) => {
    return (
      <Select style={{width: "100%"}}>
        <Option key="Developer">Developer</Option>
        <Option key="Domain Admin">Domain Admin</Option>
        <Option key="Server Admin">Server Admin</Option>
      </Select>
    );
  }
}

