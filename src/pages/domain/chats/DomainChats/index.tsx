import React, {KeyboardEvent, ReactNode} from "react";
import {Page} from "../../../../components/common/Page/";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, notification, Popconfirm, Table} from "antd";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainId} from "../../../../models/DomainId";
import {ToolbarButton} from "../../../../components/common/ToolbarButton";
import {toDomainRoute} from "../../../../utils/domain-url";
import styles from "./styles.module.css";
import {DomainChatService} from "../../../../services/domain/DomainChatService";
import {ChatInfo} from "../../../../models/domain/ChatInfo";

export interface DomainChatProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainChatProps {
  domainChatService: DomainChatService;
}

export interface DomainChatState {
  chats: ChatInfo[] | null;
  chatsFilter: string;
}

class DomainChatComponent extends React.Component<InjectedProps, DomainChatState> {
  private readonly _breadcrumbs = [{title: "Chat"}];
  private readonly _chatTableColumns: any[];
  private _chatsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._chatTableColumns = [{
      title: 'Id',
      dataIndex: 'chatId',
      sorter: (a: any, b: any) => (a.id as string).localeCompare(b.id),
      render: (text: string) => <Link to={toDomainRoute(this.props.domainId, `chats/${text}`)}>{text}</Link>
    }, {
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Type',
      dataIndex: 'type',
    }, {
      title: 'Membership',
      dataIndex: 'membership',
    },  {
      title: 'Members',
      dataIndex: 'members',
      render: (val: any[]) => val.length + ""
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
      <CardTitleToolbar title="Chat" icon="message">
        <span className={styles.search}>
          <Input placeholder="Search Chat" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <ToolbarButton icon="plus-circle" tooltip="Create Chat" onClick={this._goToCreate}/>
        <ToolbarButton icon="reload" tooltip="Reload Chats" onClick={this._loadChats}/>
      </CardTitleToolbar>
    )
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({chatsFilter: (event.target as HTMLInputElement).value}, this._loadChats);
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-chat");
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

  private _renderActions = (_: undefined, record: ChatInfo) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit Chat" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `chats/${record.chatId}`)}>
            <Button shape="circle" size="small" htmlType="button" icon="edit"/>
          </Link>
        </Tooltip>
         <Popconfirm title="Are you sure delete this chat?"
                     placement="topRight"
                     onConfirm={() => this._onDeleteChat(record.chatId)}
                     okText="Yes"
                     cancelText="No"
                     icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
         >
        <Tooltip placement="topRight" title="Delete Chat" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button"><Icon
            type="delete"/></Button>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _onDeleteChat = (chatId: string) => {
    this.props.domainChatService.deleteChat(this.props.domainId, chatId)
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

