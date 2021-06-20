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

import React, {ReactNode} from 'react';
import {DomainModelService} from "../../../../../services/domain/DomainModelService";
import { DeleteOutlined } from '@ant-design/icons';
import {Button, Card, notification, Popconfirm, Table} from "antd";
import styles from "./styles.module.css";
import Checkbox from "antd/es/checkbox/Checkbox";
import {ColumnProps} from "antd/lib/table";
import {ModelPermissions} from "../../../../../models/domain/ModelPermissions";
import {DomainId} from "../../../../../models/DomainId";
import {ModelPermissionsControl} from "../../../../../components/domain/model/ModelPermissionsControl";
import {AddModelUserPermissionControl} from "../../../../../components/domain/model/AddModelUserPermissionControl";
import {makeCancelable, PromiseSubscription} from "../../../../../utils/make-cancelable";
import {ModelPermissionSummary} from "../../../../../models/domain/ModelPermissionsSummary";
import {SERVICES} from "../../../../../services/ServiceConstants";
import {injectAs} from "../../../../../utils/mobx-utils";
import {ModelUserPermissionsEditor} from "../../../../../components/domain/model/ModelUserPermissionsEditor";
import {ModelUserPermissions} from "../../../../../models/domain/ModelUserPermissions";
import {DomainUserId} from "@convergence/convergence";
import {CheckboxChangeEvent} from "antd/lib/checkbox";

export interface ModelPermissionsProps {
  domainId: DomainId;
  modelId: string;
}

interface InjectedProps extends ModelPermissionsProps {
  domainModelService: DomainModelService;
}

export interface ModelPermissionsState {
  permissions: ModelPermissionSummary | null;
}

class ModelPermissionsTabComponent extends React.Component<InjectedProps, ModelPermissionsState> {
  private readonly _columns: ColumnProps<any>[];
  private _permissionsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
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
      width: 400,
      render: this._renderPermissions
    }, {
      title: '',
      dataIndex: '',
      align: "right",
      width: 50,
      render: (_: any, record: ModelUserPermissions) => (
        <Popconfirm title="Delete user permissions?" onConfirm={() => this._deleteUserPermission(record.userId)}>
          <Button shape="circle" size="small" icon={<DeleteOutlined />}/>
        </Popconfirm>
      )
    }];

    this.state = {
      permissions: null
    };

    this._permissionsSubscription = null;

    this._loadPermissions();
  }

  public componentWillUnmount(): void {
    if (this._permissionsSubscription !== null) {
      this._permissionsSubscription.unsubscribe();
    }
  }

  private _loadPermissions(): void {
    const {promise, subscription} =
      makeCancelable(this.props.domainModelService.getModelPermissionSummary(this.props.domainId, this.props.modelId));
    this._permissionsSubscription = subscription;
    promise.then(permissions => {
      this.setState({permissions});
      this._permissionsSubscription = null;
    });
  }

  public render(): ReactNode {
    const {permissions} = this.state;
    if (permissions !== null) {
      return (
        <div>
          <Card title="World Permissions" type="inner">
            <div className={styles.description}>These permissions apply to anyone accessing the collection, unless
              specifically overridden.
            </div>
            <div className={styles.row}>
              <Checkbox checked={permissions.overrideWorld}
                        onChange={this._onOverrideWorldChanged}>Override Collection Permissions</Checkbox>
            </div>
            <div className={styles.row}>
              <ModelPermissionsControl
                value={permissions.worldPermissions}
                onChange={this._onWorldPermissionsChanged}
              />
            </div>
          </Card>
          <Card title="User Permissions" type="inner" className={styles.userPermissions}>
            <div className={styles.userPermissionsContainer}>
              <div className={styles.description}>These permissions apply to specific users accessing the model.</div>
              <div className={styles.row}>
                <AddModelUserPermissionControl
                  domainId={this.props.domainId}
                  onAdd={this._onSetUserModelPermissions}
                />
              </div>
              <div>
                <Table dataSource={permissions.userPermissions}
                       columns={this._columns}
                       rowKey={(record: ModelUserPermissions) => record.userId.userType + ":" + record.userId.username}
                       pagination={false}
                       size="middle"/>
              </div>
            </div>
          </Card>
        </div>
      );
    } else {
      return null;
    }
  }

  private _renderPermissions = (permissions: ModelPermissions, record: ModelUserPermissions) => {
    return (
      <ModelUserPermissionsEditor value={record} onChange={this._onSetUserModelPermissions}/>
    )
  }

  private _onSetUserModelPermissions = (userPermissions: ModelUserPermissions) => {
    return this.props.domainModelService
      .setModelUserPermissions(
        this.props.domainId,
        this.props.modelId,
        userPermissions
      )
      .then(() => {
        this._loadPermissions();
        return Promise.resolve(true);
      })
      .catch((err) => {
        notification.error({
          message: "Permissions Update Failed",
          description: "Could not set permissions for user."
        });
        return Promise.resolve(false);
      });
  }

  private _onOverrideWorldChanged = (e: CheckboxChangeEvent) => {
    const overrideWorld = e.target.checked;
    const permissions = this.state.permissions!.copy({overrideWorld});
    this.setState({permissions});
    this.props.domainModelService.setOverrideCollectionWorldPermissions(
      this.props.domainId,
      this.props.modelId,
      overrideWorld
    ).catch((err) => {
      this._loadPermissions();
      console.error(err);
      notification.error({
        message: "Failed to Update Permissions",
        description: "Could not update model permissions."
      });
      return Promise.resolve(false);
    });
  }

  private _onWorldPermissionsChanged = (worldPermissions: ModelPermissions) => {
    const permissions = this.state.permissions!.copy({worldPermissions});
    this.setState({permissions});
    this.props.domainModelService.setModelWorldPermissions(
      this.props.domainId,
      this.props.modelId,
      worldPermissions
    ).catch((err) => {
      this._loadPermissions();
      console.error(err);
      notification.error({
        message: "Failed to Update Permissions",
        description: "Could not update world model permissions."
      });
      return Promise.resolve(false);
    });
  }

  private _renderUserId = (userId: DomainUserId, record: ModelUserPermissions) => {
    return (
      <div>{userId.username}</div>
    )
  }

  private _deleteUserPermission = (userId: DomainUserId) => {
    this.props.domainModelService.deleteModelUserPermissions(
      this.props.domainId,
      this.props.modelId,
      userId.username)
      .then(() => {
        this._loadPermissions();
      });
  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const ModelPermissionsTab = injectAs<ModelPermissionsProps>(injections, ModelPermissionsTabComponent);
