import {Component, ReactNode} from "react";
import * as React from "react";
import {IBreadcrumbSegment} from "../../../stores/BreacrumStore";
import {DomainBreadcrumbProducer} from "../DomainBreadcrumProducer";
import {RouteComponentProps} from "react-router";
import {Page} from "../../../components/Page";
import {Table, Icon, Button, Input, Modal, Popconfirm, message} from 'antd';
import styles from "./styles.module.css";
import Tooltip from "antd/es/tooltip";
import {DomainDescriptor} from "../../../models/DomainDescriptor";


const data = [{
  key: '1',
  username: 'john.brown',
  displayName: "John Brown",
  firstName: "John",
  lastName: "Brown",
  email: "jbrown@example.com"
}, {
  key: '2',
  username: 'tim.white',
  displayName: "Tim White",
  firstName: "Timothy",
  lastName: "White",
  email: "white.tim@example.com"
}];


// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: string[] | number[], selectedRows: any[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: any) => ({
    disabled: record.name === 'Disabled namespaces', // Column configuration not to be checked
    name: record.name,
  }),
};


export interface IDomainUsersProps extends RouteComponentProps{
  domain: DomainDescriptor;
}

export interface IDomainUsersState {
  deleteModalVisible: boolean;
}

export class DomainUsers extends Component<IDomainUsersProps, IDomainUsersState> {

  private breadcrumbsProvider = new DomainUsersBreadcrumbs();
  private _renderActions = (text: any, record: any) => {
    return (
      <span className={styles.tableActions}>
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
                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={1}>
          <Button shape="circle" size="small" htmlType="button"><Icon type="delete"/></Button>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private columns = [{
    title: 'Username',
    dataIndex: 'username',
    sorter: (a: any, b: any) => (a.username as string).localeCompare(b.username),
    render: (text: string) => <a href="javascript:;">{text}</a>
  }, {
    title: 'Display Name',
    dataIndex: 'displayName',
    sorter: (a: any, b: any) => (a.displayName as string).localeCompare(b.displayName)
  }, {
    title: 'First Name',
    dataIndex: 'firstName',
    sorter: (a: any, b: any) => (a.firstName as string).localeCompare(b.firstName)
  }, {
    title: 'Last Name',
    dataIndex: 'lastName',
    sorter: (a: any, b: any) => (a.lastName as string).localeCompare(b.lastName)
  }, {
    title: 'Email',
    dataIndex: 'email',
    sorter: (a: any, b: any) => (a.email as string).localeCompare(b.email)
  }, {
    title: 'Actions',
    dataIndex: 'operation',
    key: 'operation',
    align: 'right',
    render: this._renderActions,
  }];

  state: IDomainUsersState = {
    deleteModalVisible: false
  };

  public render(): ReactNode {

    this.breadcrumbsProvider.setDomain(this.props.domain);

    return (
      <Page title="Users"
            icon="user"
            breadcrumbs={this.breadcrumbsProvider.breadcrumbs()}>
        <div className={styles.toolbar}>
          <Input placeholder="Search"
                 defaultValue=""
                 addonAfter={<Icon type="search"/>}
          />
          <Button shape="circle" size="small" htmlType="button"><Icon type="plus-circle"/></Button>
          <Button shape="circle" size="small" htmlType="button" onClick={this._onDelete}><Icon type="delete"/></Button>
        </div>
        <Table className={styles.userTable} rowSelection={rowSelection}
               size="middle"
               columns={this.columns as any}
               dataSource={data}
        />
        {this._renderDeleteModal()}
      </Page>
    );
  }


  private _onDeleteUser = (username: string) => {
    message.success(`User '${username}' deleted.`);
  }

  private _onDelete = () => {
    this.setState({deleteModalVisible: true});
  }

  private _renderDeleteModal(): ReactNode {
    return (<Modal
      title={<span><Icon type="question-circle-o" style={{ color: 'red' }} /> Confirm Delete</span>}
      visible={this.state.deleteModalVisible}
      onOk={this._confirmDelete}
      onCancel={this._cancelDelete}
    >
      <p>Are you sure you want to delete x users?</p>
    </Modal>);
  }

  private _confirmDelete = () => {
    message.success(`Users deleted.`);
    this.setState({deleteModalVisible: false});
  }

  private _cancelDelete = () => {
    this.setState({deleteModalVisible: false});
  }
}

class DomainUsersBreadcrumbs extends DomainBreadcrumbProducer {
  public breadcrumbs(): IBreadcrumbSegment[] {
    const segments = super.breadcrumbs();
    segments.push({title: "Users"});
    return segments;
  }
}



