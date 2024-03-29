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

import React, {KeyboardEvent, ReactNode} from "react";
import Tooltip from "antd/es/tooltip";
import {
  DeleteOutlined,
  EditOutlined, KeyOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, notification, Popconfirm, Table } from "antd";
import styles from "./styles.module.css";
import {Link} from "react-router-dom";
import {DomainId} from "../../../../../models/DomainId";
import {DomainJwtKeyService} from "../../../../../services/domain/DomainJwtKeyService";
import {DomainJwtKey} from "../../../../../models/domain/DomainJwtKey";
import {makeCancelable, PromiseSubscription} from "../../../../../utils/make-cancelable";
import {toDomainRoute} from "../../../../../utils/domain-url";
import {CardTitleToolbar} from "../../../../../components/common/CardTitleToolbar/";
import {SERVICES} from "../../../../../services/ServiceConstants";
import {injectAs} from "../../../../../utils/mobx-utils";
import * as H from "history";
import {durationToNow, yesNo} from "../../../../../utils/format-utils";
import {DescriptionBox} from "../../../../../components/common/DescriptionBox";

export interface DomainJwtKeysProps {
  domainId: DomainId;
  history: H.History;
}

interface InjectedProps extends DomainJwtKeysProps {
  domainJwtKeyService: DomainJwtKeyService;
}

export interface DomainJwtKeysState {
  keys: DomainJwtKey[] | null;
  keyFilter: string;
}

class DomainJwtKeysComponent extends React.Component<InjectedProps, DomainJwtKeysState> {
  private readonly _keyTableColumns: any[];
  private _keysSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._keyTableColumns = [{
      title: 'Id',
      dataIndex: 'id',
      sorter: (a: DomainJwtKey, b: DomainJwtKey) => (a.id as string).localeCompare(b.id),
      render: (text: string) => <Link
        to={toDomainRoute(this.props.domainId, `authentication/jwt/${text}`)}>{text}</Link>
    }, {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: DomainJwtKey, b: DomainJwtKey) => (a.description).localeCompare(b.description)
    }, {
      title: 'Key Age',
      dataIndex: 'updated',
      sorter: (a: DomainJwtKey, b: DomainJwtKey) => a.updated.getTime() - b.updated.getTime(),
      render: (val: Date, _: DomainJwtKey) => durationToNow(val)
    }, {
      title: 'Enabled',
      dataIndex: 'enabled',
      sorter: (a: DomainJwtKey, _: DomainJwtKey) => a.updated,
      render: (val: boolean, _: DomainJwtKey) => yesNo(val)
    }, {
      title: '',
      align: 'right',
      width: 80,
      render: this._renderActions
    }];

    this._keysSubscription = null;

    this.state = {
      keys: null,
      keyFilter: ""
    };

    this._loadKeys();
  }

  public componentWillUnmount(): void {
    if (this._keysSubscription) {
      this._keysSubscription.unsubscribe();
      this._keysSubscription = null;
    }
  }

  public render(): ReactNode {
    return (
      <React.Fragment>
        <DescriptionBox>
          JSON Web Tokens (JWT) provide a mechanism for convergence to trust users authenticated by external systems. If
          you have an external application that you would like to have manage authentication, you can set up a
          JWT Authentication key so Convergence will trust the authentication performed by the external system. You can
          read more about JWT at <a href="https://jwt.io/" target="_blank" rel="noopener noreferrer">https://jwt.io/</a>
        </DescriptionBox>
        <Card className={styles.keysTable}
              title={this._renderToolbar()}
              type="inner"
              size="small">
          <Table
            size="middle"
            rowKey="id"
            columns={this._keyTableColumns}
            dataSource={this.state.keys || []}
          />
        </Card>
      </React.Fragment>
    );
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Keys" icon={<KeyOutlined />}>
        <span className={styles.search}>
          <Input placeholder="Search Keys" addonAfter={<SearchOutlined />} onKeyUp={this._onFilterChange}/>
        </span>
        <Tooltip placement="topRight" title="Create Key" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <PlusCircleOutlined />
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Reload Keys" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._loadKeys}>
            <ReloadOutlined />
          </Button>
        </Tooltip>
      </CardTitleToolbar>
    );
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({keyFilter: (event.target as HTMLInputElement).value}, this._loadKeys);
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "authentication/jwt/create-jwt-key");
    this.props.history.push(url);
  }

  private _renderActions = (_: undefined, record: DomainJwtKey) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit User" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `authentication/jwt/${record.id}`)}>
            <Button shape="circle" size="small" htmlType="button" icon={<EditOutlined />}/>
          </Link>
        </Tooltip>
        <Popconfirm title="Are you sure you want to delete this group?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteGroup(record.id)}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{color: 'red'}} />}
        >
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button" icon={<DeleteOutlined />}/>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _onDeleteGroup = (id: string) => {
    this.props.domainJwtKeyService.deleteKey(this.props.domainId, id)
      .then(() => {
        this._loadKeys();
        notification.success({
          message: 'Key Deleted',
          description: `The key '${id}' was deleted.`,
        });
      })
      .catch(err => {
        console.error(err);
        notification.error({
          message: 'Could Not Delete Key',
          description: `The key could not be deleted.`,
        });
      });
  }

  private _loadKeys = () => {
    const filter = this.state.keyFilter !== "" ? this.state.keyFilter : undefined;
    const {promise, subscription} = makeCancelable(this.props.domainJwtKeyService.getKeys(this.props.domainId, filter));
    this._keysSubscription = subscription;
    promise.then(keys => {
      this._keysSubscription = null;
      this.setState({keys});
    }).catch(() => {
      this._keysSubscription = null;
      this.setState({keys: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_JWT_KEY_SERVICE];
export const DomainJwtKeys = injectAs<DomainJwtKeysProps>(injections, DomainJwtKeysComponent);
