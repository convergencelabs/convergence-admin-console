import React, {KeyboardEvent, ReactNode} from "react";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, notification, Popconfirm, Table} from "antd";
import styles from "./styles.module.css";
import {Link} from "react-router-dom";
import {DomainId} from "../../../../../models/DomainId";
import {DomainJwtKeyService} from "../../../../../services/domain/DomainJwtKeyService";
import {DomainJwtKey} from "../../../../../models/domain/DomainJwtKey";
import {makeCancelable, PromiseSubscription} from "../../../../../utils/make-cancelable";
import {toDomainUrl} from "../../../../../utils/domain-url";
import {CardTitleToolbar} from "../../../../../components/common/CardTitleToolbar/";
import {SERVICES} from "../../../../../services/ServiceConstants";
import {injectAs} from "../../../../../utils/mobx-utils";
import * as H from "history";
import {durationToNow, yesNo} from "../../../../../utils/format-utils";

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
      render: (text: string) => <Link to={toDomainUrl("", this.props.domainId, `authentication/jwt/${text}`)}>{text}</Link>
    }, {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: DomainJwtKey, b: DomainJwtKey) => (a.description).localeCompare(b.description)
    }, {
      title: 'Key Age',
      dataIndex: 'updated',
      sorter: (a: DomainJwtKey, b: DomainJwtKey) => a.updated.getTime() - b.updated.getTime(),
      render: (val: Date, record: DomainJwtKey) => durationToNow(val)
    }, {
      title: 'Enabled',
      dataIndex: 'enabled',
      sorter: (a: DomainJwtKey, b: DomainJwtKey) => a.updated,
      render: (val: boolean, record: DomainJwtKey) => yesNo(val)
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

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Keys" icon="key">
        <span className={styles.search}>
          <Input placeholder="Search Keys" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <Tooltip placement="topRight" title="Create Key" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <Icon type="plus-circle"/>
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Reload Keys" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._loadKeys}>
            <Icon type="reload"/>
          </Button>
        </Tooltip>
      </CardTitleToolbar>
    )
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({keyFilter: (event.target as HTMLInputElement).value}, this._loadKeys);
  }

  private _goToCreate = () => {
    const url = toDomainUrl("", this.props.domainId, "authentication/jwt/create-jwt-key");
    this.props.history.push(url);
  }

  public render(): ReactNode {
    return (
      <Card title={this._renderToolbar()} type="inner">
        <Table className={styles.groupTable}
               size="middle"
               rowKey="id"
               columns={this._keyTableColumns}
               dataSource={this.state.keys || []}
        />
      </Card>
    );
  }

  private _renderActions = (_: undefined, record: DomainJwtKey) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit User" mouseEnterDelay={1}>
          <Link to={toDomainUrl("", this.props.domainId, `authentication/jwt/${record.id}`)}>
            <Button shape="circle" size="small" htmlType="button" icon="edit"/>
          </Link>
        </Tooltip>
        <Popconfirm title="Are you sure delete this group?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteGroup(record.id)}
                    okText="Yes"
                    cancelText="No"
                    icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
        >
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button" icon="delete"/>
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
    }).catch(err => {
      this._keysSubscription = null;
      this.setState({keys: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_JWT_KEY_SERVICE];
export const DomainJwtKeys = injectAs<DomainJwtKeysProps>(injections, DomainJwtKeysComponent);
