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
import {CollectionUserPermissionsEditor} from "../CollectionUserPermissionsEditor";
import {CollectionUserPermissions} from "../../../../models/domain/CollectionUserPermissions";
import {AddCollectionUserPermissionControl} from "../AddCollectionUserPermissionControl";
import {DomainId} from "../../../../models/DomainId";
import {CollectionPermissions} from "../../../../models/domain/CollectionPermissions";
import {DomainUserId} from "@convergence/convergence";
import styles from "./styles.module.css";
import {formatDomainUserId} from "../../../../utils/format-utils";

export interface CollectionPermissionsProps {
  domainId: DomainId;
  permissions: CollectionUserPermissions[];

  onUserPermissionsChanged(permissions: CollectionUserPermissions[]): void;
}

export class CollectionPermissionsTab extends React.Component<CollectionPermissionsProps> {
  private readonly _columns: ColumnProps<any>[];

  constructor(props: CollectionPermissionsProps) {
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
      width: 500,
      render: this._renderPermissions
    }, {
      title: '',
      dataIndex: '',
      align: "right",
      width: 50,
      render: (_: any, record: CollectionUserPermissions) => (
          <Popconfirm title="Delete user permissions?" onConfirm={() => this._deleteUserPermission(record.userId)}>
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
            <AddCollectionUserPermissionControl
                domainId={this.props.domainId}
                onSetPermissions={this._onSetUserCollectionPermissions}
            />
          </Row>
          <Row>
            <Table className={styles.table}
                   dataSource={permissions}
                   columns={this._columns}
                   rowKey={(record: CollectionUserPermissions) => record.userId.userType + ":" + record.userId.username}
                   pagination={false}
                   size="middle"/>
          </Row>
        </div>
    );
  }

  private _renderPermissions = (permissions: CollectionPermissions, record: CollectionUserPermissions) => {
    return (
        <CollectionUserPermissionsEditor value={record} onChange={this._onSetUserCollectionPermissions}/>
    )
  }

  private _onSetUserCollectionPermissions = (userPermissions: CollectionUserPermissions) => {
    const p = this.props.permissions.filter(p => !p.userId.equals(userPermissions.userId));
    p.push(userPermissions);
    this.props.onUserPermissionsChanged(p);
  }

  private _renderUserId = (userId: DomainUserId, _: CollectionUserPermissions) => {
    return (<div>{formatDomainUserId(userId)}</div>);
  }

  private _deleteUserPermission = (userId: DomainUserId) => {
    const p = this.props.permissions.filter(p => !p.userId.equals(userId));
    this.props.onUserPermissionsChanged(p);
  }
}
