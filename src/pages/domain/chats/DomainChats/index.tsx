import * as React from 'react';
import {Page} from "../../../../components/common/Page/";
import {KeyboardEvent, ReactNode} from "react";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, notification, Popconfirm, Table} from "antd";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainId} from "../../../../models/DomainId";
import {CollectionSummary} from "../../../../models/domain/CollectionSummary";
import {ToolbarButton} from "../../../../components/common/ToolbarButton";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {toDomainUrl} from "../../../../utils/domain-url";
import styles from "./styles.module.css";
import {DomainChatService} from "../../../../services/domain/DomainChatService";

export interface DomainChatProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainChatProps {
  domainChatService: DomainChatService;
}

export interface DomainChatState {
  chats: CollectionSummary[] | null;
  chatsFilter: string;
}

class DomainChatComponent extends React.Component<InjectedProps, DomainChatState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private readonly _chatTableColumns: any[];
  private _chatsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId,[{title: "Chat"}]);
    this._chatTableColumns = [{
      title: 'Id',
      dataIndex: 'id',
      sorter: (a: any, b: any) => (a.id as string).localeCompare(b.id),
      render: (text: string) => <Link to={toDomainUrl("", this.props.domainId, `chats/${text}`)}>{text}</Link>
    }, {
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Type',
      dataIndex: 'channelType',
    }, {
      title: '',
      align: 'right',
      width: 80,
      render: this._renderActions
    }];

    this._chatsSubscription = null;

    this.state = {
      chats: null,
      chatsFilter: ""
    };

    this._loadChats();
  }

  public componentWillUnmount(): void {
    if (this._chatsSubscription) {
      this._chatsSubscription.unsubscribe();
      this._chatsSubscription = null;
    }
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Chat" icon="folder">
        <span className={styles.search}>
          <Input placeholder="Search Chat" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <ToolbarButton icon="plus-circle" tooltip="Create Collection" onClick={this._goToCreate}/>
        <ToolbarButton icon="reload" tooltip="Reload Chat" onClick={this._loadChats}/>
      </CardTitleToolbar>
    )
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({chatsFilter: (event.target as HTMLInputElement).value}, this._loadChats);
  }

  private _goToCreate = () => {
    const url = toDomainUrl("", this.props.domainId, "create-collection");
    this.props.history.push(url);
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 size="middle"
                 rowKey="id"
                 columns={this._chatTableColumns}
                 dataSource={this.state.chats || []}
          />
        </Card>
      </Page>
    );
  }

  private _renderActions = (_: undefined, record: CollectionSummary) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit Collection" mouseEnterDelay={1}>
          <Link to={toDomainUrl("", this.props.domainId, `chats/${record.id}`)}>
            <Button shape="circle" size="small" htmlType="button" icon="edit"/>
          </Link>
        </Tooltip>
         <Popconfirm title="Are you sure delete this collection?"
                     placement="topRight"
                     onConfirm={() => this._onDeleteCollection(record.id)}
                     okText="Yes"
                     cancelText="No"
                     icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
         >
        <Tooltip placement="topRight" title="Delete Collection" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button"><Icon
            type="delete"/></Button>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _onDeleteCollection = (chatId: string) => {
    const domainId = new DomainId(this.props.domainId.namespace, this.props.domainId.id);
    this.props.domainChatService.deleteChat(domainId, chatId)
      .then(() => {
        this._loadChats();
        notification.success({
          message: 'Chat Deleted',
          description: `The chat '${chatId}' was deleted.`,
        });
      })
      .catch(err => {
        notification.error({
          message: 'Could Not Delete Chat',
          description: `The chat could not be deleted.`,
        });
      });
  }

  private _loadChats = () => {
    const domainId = this.props.domainId;
    const filter = this.state.chatsFilter !== "" ? this.state.chatsFilter : undefined;
    const {promise, subscription} = makeCancelable(this.props.domainChatService.getChats(domainId, filter));
    this._chatsSubscription = subscription;
    promise.then(chats => {
      this._chatsSubscription = null;
      this.setState({chats});
    }).catch(err => {
      console.error(err);
      this._chatsSubscription = null;
      this.setState({chats: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_CHAT_SERVICE];
export const DomainChats = injectAs<DomainChatProps>(injections, DomainChatComponent);

