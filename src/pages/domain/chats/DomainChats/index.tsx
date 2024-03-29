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
import {Page} from "../../../../components";
import Tooltip from "antd/es/tooltip";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {Button, Card, Input, notification, Popconfirm, Table, TablePaginationConfig} from "antd";
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
import {PagedData} from "../../../../models/PagedData";
import queryString from "query-string";
import {appendToQueryParamString} from "../../../../utils/router-utils";

export interface IChatSearchParams {
  filter?: string;
  pageSize: number;
  page: number;
}

export interface DomainChatProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainChatProps {
  domainChatService: DomainChatService;
}

export interface DomainChatState {
  chats: PagedData<ChatInfo>;
  searchParams: IChatSearchParams;
}

class DomainChatComponent extends React.Component<InjectedProps, DomainChatState> {
  private readonly _breadcrumbs = [{title: "Chats"}];
  private readonly _chatTableColumns: any[];
  private _chatsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._chatTableColumns = [{
      title: 'Id',
      dataIndex: 'chatId',
      sorter: (a: ChatInfo, b: ChatInfo) => a.chatId.localeCompare(b.chatId),
      render: (text: string) => <Link to={toDomainRoute(this.props.domainId, `chats/${encodeURIComponent(text)}`)}>{text}</Link>
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
      width: 110,
      render: this._renderActions
    }];

    this._chatsSubscription = null;

    const searchParams = this._parseQueryInput(this.props.location.search);

    this.state = {
      chats: PagedData.EMTPY,
      searchParams
    };
  }

  public componentDidMount(): void {
    this._loadChats();
  }

  public componentWillUnmount(): void {
    if (this._chatsSubscription) {
      this._chatsSubscription.unsubscribe();
      this._chatsSubscription = null;
    }
  }

  public componentDidUpdate(prevProps: InjectedProps, prevState: DomainChatState): void {
    // First see if the route has changes, If so we set the current state.
    // then later we see if that changed our actual params we care about.
    if (prevProps.location.search !== this.props.location.search) {
      const searchParams = this._parseQueryInput(this.props.location.search);
      this.setState({
        searchParams
      });
    } else if (prevState.searchParams.filter !== this.state.searchParams.filter ||
      prevState.searchParams.pageSize !== this.state.searchParams.pageSize ||
      prevState.searchParams.page !== this.state.searchParams.page) {
      this._loadChats();
    }
  }

  public render(): ReactNode {
    const pagination: TablePaginationConfig = {
      pageSize: this.state.searchParams.pageSize,
      current: this.state.searchParams.page,
      total: this.state.chats.totalResults,
      onChange: this._pageChange,
      showTotal: (total: number) => `${total} total results`
    };

    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 size="middle"
                 rowKey="chatId"
                 columns={this._chatTableColumns}
                 dataSource={this.state.chats.data}
                 pagination={pagination}
          />
        </Card>
      </Page>
    );
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Chat" icon={<MessageOutlined />}>
        <span className={styles.search}>
          <Input placeholder="Search Chat" addonAfter={<SearchOutlined />} onKeyUp={this._onFilterChange}/>
        </span>
        <ToolbarButton icon={<PlusCircleOutlined />} tooltip="Create Chat" onClick={this._goToCreate}/>
        <ToolbarButton icon={<ReloadOutlined />} tooltip="Reload Chats" onClick={this._loadChats}/>
      </CardTitleToolbar>
    );
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-chat");
    this.props.history.push(url);
  }

  private _renderActions = (_: undefined, record: ChatInfo) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="View Chat" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `chats/${encodeURIComponent(record.chatId)}`)}>
            <Button shape="circle" size="small" htmlType="button" icon={<EyeOutlined />}/>
          </Link>
        </Tooltip>
        <Tooltip placement="topRight" title="Edit Chat" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `chats/${encodeURIComponent(record.chatId)}/edit`)}>
            <Button shape="circle" size="small" htmlType="button" icon={<EditOutlined />}/>
          </Link>
        </Tooltip>
         <Popconfirm title="Are you sure you want to delete this chat?"
                     placement="topRight"
                     onConfirm={() => this._onDeleteChat(record.chatId)}
                     okText="Yes"
                     cancelText="No"
                     icon={<QuestionCircleOutlined style={{color: 'red'}} />}
         >
        <Tooltip placement="topRight" title="Delete Chat" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button"><DeleteOutlined /></Button>
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
      .catch(() => {
        notification.error({
          message: 'Could Not Delete Chat',
          description: `The chat could not be deleted.`,
        });
      });
  }

  private _loadChats = () => {
    const domainId = this.props.domainId;
    const filter = this.state.searchParams.filter !== "" ? this.state.searchParams.filter : undefined;
    const offset = this.state.searchParams.page === undefined ? 0 : ((this.state.searchParams.page - 1) * this.state.searchParams.pageSize);
    const pageSize = this.state.searchParams.pageSize;
    const {promise, subscription} = makeCancelable(this.props.domainChatService.getChats(domainId, filter, offset, pageSize));
    this._chatsSubscription = subscription;
    promise.then(chats => {
      this._chatsSubscription = null;
      this.setState({chats});
    }).catch(err => {
      console.error(err);
      this._chatsSubscription = null;
      this.setState({chats: PagedData.EMTPY});
    });
  }

  private _pageChange = (page: number, pageSize?: number) => {
    pageSize = pageSize || 25;
    let newUrl = appendToQueryParamString({page, pageSize});
    this.props.history.push(newUrl);
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    // todo debounce
    const filter = (event.target as HTMLInputElement).value;
    const page = 1;
    const pageSize = this.state.searchParams.pageSize;

    let newUrl = appendToQueryParamString({filter, page, pageSize});
    this.props.history.push(newUrl);
  }

  private _parseQueryInput(urlQueryParams: string): IChatSearchParams {
    let {
      filter,
      pageSize,
      page
    } = queryString.parse(urlQueryParams, {parseNumbers: true});

    return {
      filter: filter ? filter + "" : undefined,
      pageSize: pageSize as number || 25,
      page: page as number || 1
    };
  }
}

const injections = [SERVICES.DOMAIN_CHAT_SERVICE];
export const DomainChats = injectAs<DomainChatProps>(injections, DomainChatComponent);

