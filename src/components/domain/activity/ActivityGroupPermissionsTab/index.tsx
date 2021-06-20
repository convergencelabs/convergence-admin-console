/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ReactNode} from 'react';
import {DeleteOutlined} from '@ant-design/icons';
import {Button, Popconfirm, Row, Table} from "antd";
import {ColumnProps} from "antd/lib/table";
import {DomainId} from "../../../../models/DomainId";
import {ActivityPermissions} from "../../../../models/domain/ActivityPermissions";
import {ActivityGroupPermissions} from "../../../../models/domain/ActivityGroupPermissions";

import styles from "./styles.module.css";
import {SetActivityUserPermissionControl} from "../SetActivityGroupPermissionControl";
import {ActivityGroupPermissionsEditor} from "../ActivityGroupPermissionsEditor";


export interface ActivityPermissionsProps {
  domainId: DomainId;
  permissions: ActivityGroupPermissions[];

  onGroupPermissionsChanged(permissions: ActivityGroupPermissions[]): void;
}

export class ActivityGroupPermissionsTab extends React.Component<ActivityPermissionsProps> {
  private readonly _columns: ColumnProps<any>[];

  constructor(props: ActivityPermissionsProps) {
    super(props);

    this._columns = [{
      title: 'Group',
      dataIndex: 'groupId',
      align: "left",
      sorter: (a: any, b: any) => a.groupId.toLocaleLowerCase().localeCompare(b.groupId.toLocaleLowerCase()),
    }, {
      title: 'Permissions',
      dataIndex: 'permissions',
      align: "center",
      width: 600,
      render: this._renderPermissions
    }, {
      title: '',
      dataIndex: '',
      align: "right",
      width: 50,
      render: (_: any, record: ActivityGroupPermissions) => (
          <Popconfirm title="Delete group permissions?" onConfirm={() => this._deleteGroupPermission(record.groupId)}>
            <Button shape="circle" size="small" icon={<DeleteOutlined />}/>
          </Popconfirm>
      )
    }];
  }

  public render(): ReactNode {
    const {permissions} = this.props;
    return (
        <div>
          <Row>
            <SetActivityUserPermissionControl
                domainId={this.props.domainId}
                onSetPermissions={this._onSetGroupActivityPermissions}
            />
          </Row>
          <Row>
            <Table className={styles.table}
                   dataSource={permissions}
                   columns={this._columns}
                   rowKey={(record: ActivityGroupPermissions) => record.groupId}
                   pagination={false}
                   size="middle"/>
          </Row>
        </div>
    );
  }

  private _renderPermissions = (permissions: ActivityPermissions, record: ActivityGroupPermissions) => {
    return (
        <ActivityGroupPermissionsEditor value={record} onChange={this._onSetGroupActivityPermissions}/>
    )
  }

  private _onSetGroupActivityPermissions = (groupPermissions: ActivityGroupPermissions) => {
    const p = this.props.permissions.filter(p => p.groupId !== groupPermissions.groupId);
    p.push(groupPermissions);
    this.props.onGroupPermissionsChanged(p);
  }

  private _deleteGroupPermission = (groupId: string) => {
    const p = this.props.permissions.filter(p => p.groupId !== groupId);
    this.props.onGroupPermissionsChanged(p);
  }
}
