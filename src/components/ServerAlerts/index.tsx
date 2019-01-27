import * as React from 'react';
import {Component, ReactNode} from "react";
import styles from "./styles.module.css";
import {Card, Icon, Table} from "antd";
import moment from "moment";


interface ServerMessage {
  id: string,
  type: string;
  message: string;
  time: Date;
}

const data: ServerMessage[] = [
  {id: "0", type: "warning", message: "A warning", time: moment("2019-01-22 09:30:26.123").toDate()},
  {id: "1", type: "error", message: "A critical error", time: new Date()},
  {id: "2", type: "info", message: "A message", time: new Date()}
];

export class ServerAlerts extends Component<{}, {}> {
  private readonly _tableColumns: any[];

  constructor(props: any) {
    super(props);

    this._tableColumns = [{
      title: '!',
      dataIndex: 'type',
      sorter: ServerAlerts._sortType,
      render: ServerAlerts._renderType,
      width: 40
    }, {
      title: 'Time',
      dataIndex: 'time',
      sorter: (a: ServerMessage, b: ServerMessage) => a.time.getTime() - b.time.getTime(),
      render: (date: Date) => <span>{moment(date).format("MM/DD @ HH:mma")}</span>,
      width: 150
    }, {
      title: 'Message',
      dataIndex: 'message',
      sorter: (a: any, b: any) => (a.email as string).localeCompare(b.email)
    }];
  }

  public render(): ReactNode {
    return (
      <Card className={styles.alerts} title={<span><Icon type="warning"/> Alerts & Messages</span>}>
        <Table className={styles.userTable}
               size="small"
               columns={this._tableColumns}
               pagination={false}
               dataSource={data}
               rowKey="id"
               scroll={{ y: 125 }}
        />
      </Card>
    );
  }

  private static _sortType = (a: ServerMessage, b: ServerMessage) => {
    return ServerAlerts._toTypePriority(a.type) - ServerAlerts._toTypePriority(b.type);
  }

  private static _toTypePriority(type: string): number {
    switch (type) {
      case "warning":
        return 2;
      case "error":
        return 3;
      case "info":
        return 1;
      default:
        return 0;
    }
  }

  private static _renderType = (text: any, record: any) => {
    switch (record.type) {
      case "warning":
        return (<Icon type="warning" style={{color: "orange"}}/>);
      case "error":
        return (<Icon type="exclamation-circle" style={{color: "red"}}/>);
      case "info":
        return (<Icon type="mail" style={{color: "blue"}}/>);
    }
  }
}
