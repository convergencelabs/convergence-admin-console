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
import { DeleteOutlined } from '@ant-design/icons';
import {Button, Popconfirm, Row, Table} from "antd";
import {ColumnProps} from "antd/lib/table";
import {ActivityUserPermissionsEditor} from "../ActivityUserPermissionsEditor";
import {ActivityUserPermissions} from "../../../../models/domain/activity/ActivityUserPermissions";
import {SetActivityUserPermissionControl} from "../SetActivityUserPermissionControl";
import {DomainId} from "../../../../models/DomainId";
import {ActivityPermissions} from "../../../../models/domain/activity/ActivityPermissions";
import {DomainUserId} from "@convergence/convergence";
import styles from "./styles.module.css";
import {formatDomainUserId} from "../../../../utils/format-utils";

export interface ActivityPermissionsProps {
  domainId: DomainId;
  permissions: ActivityUserPermissions[];

  onUserPermissionsChanged(allPermissions: ActivityUserPermissions[], updated: ActivityUserPermissions): void;
}

export class ActivityUserPermissionsTab extends React.Component<ActivityPermissionsProps> {
  private readonly _columns: ColumnProps<any>[];

  constructor(props: ActivityPermissionsProps) {
    super(props);

    this._columns = [{
      title: 'Username',
      dataIndex: 'userId',
      align: "left",
      sorter: (a: any, b: any) => a.username.toLocaleLowerCase().localeCompare(b.username.toLocaleLowerCase()),
      render: this._renderUserId
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
      render: (_: any, record: ActivityUserPermissions) => (
          <Popconfirm title="Delete user permissions?" onConfirm={() => this._deleteUserPermission(record.userId)}>
            <Button shape="circle" size="small" icon={<DeleteOutlined />}/>
          </Popconfirm>
      )
    }];
  }

  public render(): ReactNode {
    const {permissions} = this.props;
    const p = permissions.slice().sort((a, b) => a.userId.username.localeCompare(b.userId.username))
    return (
        <div>
          <Row>
            <SetActivityUserPermissionControl
                domainId={this.props.domainId}
                onSetPermissions={this._onSetUserActivityPermissions}
            />
          </Row>
          <Row>
            <Table className={styles.table}
                   dataSource={p}
                   columns={this._columns}
                   rowKey={(record: ActivityUserPermissions) => record.userId.userType + ":" + record.userId.username}
                   pagination={false}
                   size="middle"/>
          </Row>
        </div>
    );
  }

  private _renderPermissions = (permissions: ActivityPermissions, record: ActivityUserPermissions) => {
    return (
        <ActivityUserPermissionsEditor value={record} onChange={this._onSetUserActivityPermissions}/>
    )
  }

  private _onSetUserActivityPermissions = (userPermissions: ActivityUserPermissions) => {
    const p = this.props.permissions.filter(p => !p.userId.equals(userPermissions.userId));
    p.push(userPermissions);
    if (this.props.onUserPermissionsChanged) {
      this.props.onUserPermissionsChanged(p, userPermissions);
    }
  }

  private _renderUserId = (userId: DomainUserId, _: ActivityUserPermissions) => {
    return (<div>{formatDomainUserId(userId)}</div>);
  }

  private _deleteUserPermission = (userId: DomainUserId) => {
    const p = this.props.permissions.filter(p => !p.userId.equals(userId));
    if (this.props.onUserPermissionsChanged) {
      this.props.onUserPermissionsChanged(p, new ActivityUserPermissions(userId, ActivityPermissions.NONE));
    }
  }
}
