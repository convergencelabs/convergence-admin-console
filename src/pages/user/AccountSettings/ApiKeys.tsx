import React, {ReactNode} from 'react';
import {Button, Card, Icon, notification, Popconfirm, Table} from "antd";
import styles from "./styles.module.css";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {RouteComponentProps} from "react-router";
import {CardTitleToolbar} from "../../../components/common/CardTitleToolbar";
import Tooltip from "antd/es/tooltip";
import {LoggedInUserService} from "../../../services/LoggedInUserService";
import {shortDateTime} from "../../../utils/format-utils";
import {ApiKeyService} from "../../../services/ApiKeyService";
import {UserApiKey} from "../../../models/UserApiKey";
import {Link} from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";

interface InjectedProps extends RouteComponentProps {
  apiKeyService: ApiKeyService;
  loggedInUserService: LoggedInUserService;
}

export interface ApiKeysState {
  apiKeys: UserApiKey[] | null;
}

export class ApiKeysComponent extends React.Component<InjectedProps, ApiKeysState> {
  private readonly _tableColumns: any[];
  private _apiKeysSubscription: PromiseSubscription | null;


  constructor(props: InjectedProps) {
    super(props);
    this._tableColumns = [{
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: UserApiKey, b: UserApiKey) => (a.name as string).localeCompare(b.name)
    }, {
      title: 'Key',
      dataIndex: 'key',
      sorter: (a: UserApiKey, b: UserApiKey) => (a.key as string).localeCompare(b.key)
    }, {
      title: 'Enabled',
      dataIndex: 'enabled',
      sorter: (a: UserApiKey, b: UserApiKey) => {
        if (a.enabled && !b.enabled) {
          return -1;
        } else if (!a.enabled && b.enabled) {
          return 1;
        } else {
          return 0;
        }
      },
      render: (text: string, apiKey: UserApiKey) => {
        return apiKey.enabled ? "Yes" : "No";
      }
    }, {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      align: 'left',
      sorter: (a: UserApiKey, b: UserApiKey) => {
        if (a.lastUsed && !b.lastUsed) {
          return -1;
        } else if (!a.lastUsed && b.lastUsed) {
          return 1;
        } else if (a.lastUsed === b.lastUsed) {
          return 0;
        } else {
          return a.lastUsed!.getTime() - b.lastUsed!.getTime();
        }
      },
      render: (val: any, apiKey: UserApiKey) => (
        <span>{apiKey.lastUsed ? shortDateTime(apiKey.lastUsed) : "Never Used"}</span>
      )
    }, {
      title: '',
      dataIndex: '',
      width: '120px',
      align: 'right',
      render: this._renderActions
    }];

    this._apiKeysSubscription = null;

    this.state = {
      apiKeys: null,
    };

    this._loadApiKeys();
  }

  public componentWillUnmount(): void {
    if (this._apiKeysSubscription) {
      this._apiKeysSubscription.unsubscribe();
    }
  }

  public render(): ReactNode {
    return (
      <Card title={this._renderToolbar()}>
        <Table className={styles.userTable}
               size="middle"
               rowKey={record => record.key}
               columns={this._tableColumns}
               dataSource={this.state.apiKeys || []}
        />
      </Card>
    );
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="API Keys" icon="key">
        <Tooltip placement="topRight" title="Create API Key" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <Icon type="plus-circle"/>
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Reload API Keys" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._loadApiKeys}>
            <Icon type="reload"/>
          </Button>
        </Tooltip>
      </CardTitleToolbar>
    )
  }

  private _renderActions = (text: any, record: UserApiKey) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Copy Key" mouseEnterDelay={1}>
         <CopyToClipboard text={record.key}>
          <Button shape="circle" size="small" htmlType="button" icon="copy"/>
        </CopyToClipboard>
        </Tooltip>
        <Tooltip placement="topRight" title="Edit API Key" mouseEnterDelay={1}>
          <Link to={`/api-keys/${record.key}`}>
            <Button shape="circle" size="small" htmlType="button" icon="edit"/>
          </Link>
        </Tooltip>
        <Popconfirm title="Are you sure delete this API Key?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteApiKey(record.key, record.name)}
                    okText="Yes"
                    cancelText="No"
                    icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
        >
        <Tooltip placement="topRight" title="Delete API Key" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button" icon="delete"/>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _goToCreate = () => {
    this.props.history.push("/create-api-key");
  }

  private _onDeleteApiKey = (key: string, name: string) => {
    this.props.apiKeyService.deleteUserApiKey(key)
      .then(() => {
        this._loadApiKeys();
        notification.success({
          message: 'Success',
          description: `API Key '${name}' was deleted.`,
        });
      })
      .catch(err => {
        notification.error({
          message: 'Could Not Delete API Key',
          description: `The API Key could not be deleted.`,
        });
      });
  }

  private _loadApiKeys = () => {
    const {promise, subscription} =
      makeCancelable(this.props.apiKeyService.getApiKeys());
    this._apiKeysSubscription = subscription;

    promise.then(keys => {
      this.setState({
        apiKeys: keys
      });
    }).catch(err => {
      this._apiKeysSubscription = null;
      this.setState({apiKeys: null});
    });
  }
}

const injections = [SERVICES.API_KEY_SERVICE, SERVICES.LOGGED_IN_USER_SERVICE];
export const ApiKeys = injectAs<RouteComponentProps>(injections, ApiKeysComponent);
