import * as React from 'react';
import {Component, ReactNode} from 'react';
import styles from "./styles.module.css";
import {Button, Card, Icon, Table} from "antd";
import {shortDateTime} from "../../../utils/format-utils";


interface ServerMessage {
  id: string,
  type: string;
  message: string;
  time: Date;
}

const data: ServerMessage[] = [
  // {id: "0", type: "warning", message: "A warning", time: moment("2019-01-22 09:30:26.123").toDate()},
  // {id: "1", type: "error", message: "A critical error", time: new Date()},
  // {id: "2", type: "info", message: "A message", time: new Date()},
  // {id: "3", type: "info", message: "A message", time: new Date()},
  // {id: "4", type: "info", message: "A message", time: new Date()},
];

export class ServerAlerts extends Component<{}, {}> {
  private readonly _tableColumns: any[];

  constructor(props: any) {
    super(props);

    this._tableColumns = [{
      title: '',
      dataIndex: 'type',
      sorter: ServerAlerts._sortType,
      render: ServerAlerts._renderType,
      width: 40
    }, {
      title: 'Time',
      dataIndex: 'time',
      sorter: (a: ServerMessage, b: ServerMessage) => a.time.getTime() - b.time.getTime(),
      render: (date: Date) => shortDateTime(date),
      width: 150
    }, {
      title: 'Message',
      dataIndex: 'message',
      sorter: (a: any, b: any) => (a.message as string).localeCompare(b.message)
    }, {
      title: '',
      dataIndex: 'actions',
      render: ServerAlerts._renderActions,
      align: "right",
      width: 40
    }];

  }

  public render(): ReactNode {
    return (
      <Card className={styles.alerts} title={<span><Icon type="warning"/> Alerts</span>}>
        <Table className={styles.alertTable}
               size="small"
               columns={this._tableColumns}
               pagination={false}
               dataSource={data}
               rowKey="id"
               scroll={{ y: 121 }}
               locale={{emptyText: "No Alerts"}}
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
        return (<Icon type="close-square" style={{color: "red"}}/>);
      case "info":
        return (<Icon type="info-circle" style={{color: "#2388a9"}}/>);
    }
  }
  private static _renderActions = (text: any, record: any) => {
    return (<Button htmlType="button" size="small" shape="circle" icon="delete"/>);
  }
}
