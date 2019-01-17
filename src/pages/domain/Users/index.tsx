import {Component, ReactNode} from "react";
import * as React from "react";
import {IBreadcrumbSegment} from "../../../stores/BreacrumStore";
import {DomainBreadcrumbProducer} from "../DomainBreadcrumProducer";
import {match, RouteComponentProps} from "react-router";
import {Page} from "../../../components/Page";
import {Table} from 'antd';
import styles from "./styles.module.css";

const columns = [{
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
}];

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
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};


export class DomainUsers extends Component<RouteComponentProps, {}> {

  private breadcrumbsProvider = new DomainUsersBreadcrumbs();

  public render(): ReactNode {
    return (
      <Page title="Users"
            icon="user"
            breadcrumbs={this.breadcrumbsProvider.breadcrumbs(this.props.match)}>
        <Table className={styles.userTable} rowSelection={rowSelection}
               columns={columns as any}
               dataSource={data}
               pagination={false}/>
      </Page>
    );
  }
}

class DomainUsersBreadcrumbs extends DomainBreadcrumbProducer {
  public breadcrumbs(match: match): IBreadcrumbSegment[] {
    const segments = super.breadcrumbs(match);
    segments.push({title: "Users"});
    return segments;
  }
}



