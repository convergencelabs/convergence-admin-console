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

import * as React from 'react';
import {Component, ReactNode} from 'react';
import styles from "./styles.module.css";
import { CloseSquareOutlined, DeleteOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Card, Table } from "antd";
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
      <Card className={styles.alerts} title={<span><WarningOutlined /> Alerts</span>}>
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
        return <WarningOutlined style={{color: "orange"}} />;
      case "error":
        return <CloseSquareOutlined style={{color: "red"}} />;
      case "info":
        return <InfoCircleOutlined style={{color: "#2388a9"}} />;
    }
  }
  private static _renderActions = (text: any, record: any) => {
    return <Button htmlType="button" size="small" shape="circle" icon={<DeleteOutlined />}/>;
  }
}
