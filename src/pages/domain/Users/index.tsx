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
  render: (text: string) => <a href="javascript:;">{text}</a>,
}, {
  title: 'Email',
  dataIndex: 'age',
  sorter: (a: any, b: any) => a.age - b.age
}, {
  title: 'Address',
  dataIndex: 'address',
}];

const data = [{
  key: '1',
  username: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  username: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  username: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  username: 'Disabled User',
  age: 99,
  address: 'Sidney No. 1 Lake Park',
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



