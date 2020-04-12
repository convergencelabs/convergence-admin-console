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
import {Page} from "../../../../components/common/Page/";
import {Card, Icon, Input, Table, Tabs} from "antd";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainId} from "../../../../models/DomainId";
import {ToolbarButton} from "../../../../components/common/ToolbarButton";
import styles from "./styles.module.css";
import {DomainChatService} from "../../../../services/domain/DomainChatService";
import {ChatInfo} from "../../../../models/domain/ChatInfo";
import {PagedData} from "../../../../models/PagedData";
import queryString from "query-string";
import {SearchParams} from "../../collections/DomainCollections";
import {appendToQueryParamString} from "../../../../utils/router-utils";
import {PaginationConfig} from "antd/lib/pagination";
import {
  ChatCreatedEvent,
  ChatEvent,
  ChatMessageEvent,
  ChatNameChangedEvent,
  ChatTopicChangedEvent,
  ChatUserAddedEvent,
  ChatUserRemovedEvent
} from "../../../../models/domain/ChatEvent";
import {shortDateTime} from "../../../../utils/format-utils";
import {DomainUserId, DomainUserType} from "../../../../models/domain/DomainUserId";
import {InfoTable, InfoTableRow} from "../../../../components/server/InfoTable";
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";
import {toDomainRoute} from "../../../../utils/domain-url";

export interface IChatSearchParams {
  filter?: string;
  pageSize: number;
  page: number;
}

export interface ViewChatProps extends RouteComponentProps<{ id: string }> {
  domainId: DomainId;
}

interface InjectedProps extends ViewChatProps {
  domainChatService: DomainChatService;
}

export interface ViewChatState {
  chatInfo: ChatInfo | null;
  chatEvents: PagedData<ChatEvent>
  searchParams: IChatSearchParams;
}

class ViewChatEventsComponent extends React.Component<InjectedProps, ViewChatState> {
  private readonly _breadcrumbs: IBreadcrumbSegment[] = [
    {title: "Chats", link: toDomainRoute(this.props.domainId, "chats/") },
    {title: this.props.match.params.id}
  ];
  private readonly _chatEventTableColumns: any[];
  private _chatsSubscription: PromiseSubscription | null;
  private _chatEventsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    const renderEventData = (data: any) => {
      const content = JSON.stringify(data, null, "  ");
      return content;
    };

    const renderUsername = (userId: DomainUserId) => {
      if (userId.type === DomainUserType.ANONYMOUS) {
        return `${userId.username} (Anonymous)`;
      } else if (userId.type === DomainUserType.CONVERGENCE) {
        return `${userId.username} (Convergence)`;
      } else {
        return userId.username;
      }
    }

    this._chatEventTableColumns = [{
      title: 'Event No',
      dataIndex: 'eventNumber',
      sorter: (a: ChatEvent, b: ChatEvent) => a.eventNumber - b.eventNumber,
    }, {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      render: (d: Date) => shortDateTime(d)
    }, {
      title: 'Type',
      dataIndex: 'type',
      render: (type: string) => {
        switch (type) {
          case "created": {
            return <span><Icon type="file-add"/> Created</span>;
          }
          case "message": {
            return <span><Icon type="message"/> Message</span>;
          }
          case "user_joined": {
            return <span><Icon type="login"/> User Joined</span>;
          }
          case "user_left": {
            return <span><Icon type="logout"/> User Left</span>;
          }
          case "user_added": {
            return <span><Icon type="user-add"/> User Added</span>;
          }
          case "user_removed": {
            return <span><Icon type="user-delete"/> User Removed</span>;
          }
          case "name_changed": {
            return <span><Icon type="file-text"/> Name Changed</span>;
          }
          case "topic_changed": {
            return <span><Icon type="file-text"/> Topic Changed</span>;
          }
        }
      }
    }, {
      title: 'User',
      dataIndex: 'userId',
      render: renderUsername

    }, {
      title: 'Data',
      render: (_: any, event: ChatEvent) => {
        switch (event.type) {
          case "created": {
            const createdEvent = event as ChatCreatedEvent;
            return renderEventData({
              members: JSON.stringify(createdEvent.members),
              name: createdEvent.name,
              topic: createdEvent.topic
            });
          }
          case "message": {
            const messageEvent = event as ChatMessageEvent;
            return renderEventData({
              message: messageEvent.message
            });
          }
          case "user_joined": {
            return renderEventData({});
          }
          case "user_left": {
            return renderEventData({});
          }
          case "user_added": {
            const addedEvent = event as ChatUserAddedEvent;
            return renderEventData({
              addedUser: renderUsername(addedEvent.addedUserId)
            });
          }
          case "user_removed": {
            const removedEvent = event as ChatUserRemovedEvent;
            return renderEventData({
              addedUser: renderUsername(removedEvent.removedUserId)
            });
          }
          case "name_changed": {
            const nameEvent = event as ChatNameChangedEvent;
            return renderEventData({
              name: nameEvent.name
            });
          }
          case "topic_changed": {
            const topicEvent = event as ChatTopicChangedEvent;
            return renderEventData({
              topic: topicEvent.topic
            });
          }
        }
        return;
      }
    }];


    this._chatsSubscription = null;
    this._chatEventsSubscription = null;

    const searchParams = this._parseQueryInput(this.props.location.search);

    this.state = {
      chatInfo: null,
      chatEvents: PagedData.EMTPY,
      searchParams
    };
  }

  public componentDidMount(): void {
    this._loadChatInfo();
    this._loadChatEvents();
  }

  public componentWillUnmount(): void {
    if (this._chatsSubscription) {
      this._chatsSubscription.unsubscribe();
      this._chatsSubscription = null;
    }

    if (this._chatEventsSubscription) {
      this._chatEventsSubscription.unsubscribe();
      this._chatEventsSubscription = null;
    }
  }

  public componentDidUpdate(prevProps: InjectedProps, prevState: ViewChatState): void {
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
      this._loadChatEvents();
    }
  }

  public render(): ReactNode {
    const pagination: PaginationConfig = {
      pageSize: this.state.searchParams.pageSize,
      current: this.state.searchParams.page,
      total: this.state.chatEvents.totalResults,
      onChange: this._pageChange,
      showTotal: (total: number) => `${total} total results`
    };

    let chat = null;
    if (this.state.chatInfo) {
      chat =
        <Tabs>
          <Tabs.TabPane key="info" tab="Info">
            <InfoTable>
              <InfoTableRow label="Id">{this.props.match.params.id}</InfoTableRow>
              <InfoTableRow label="Type">{this.state.chatInfo?.type}</InfoTableRow>
              <InfoTableRow label="Membership">{this.state.chatInfo?.membership}</InfoTableRow>
              <InfoTableRow label="Name">{this.state.chatInfo?.name}</InfoTableRow>
              <InfoTableRow label="Topic">{this.state.chatInfo?.name}</InfoTableRow>
              <InfoTableRow label="Members">{this.state.chatInfo?.members.length}</InfoTableRow>
            </InfoTable>
          </Tabs.TabPane>
          <Tabs.TabPane key="members" tab="Members">

          </Tabs.TabPane>
        </Tabs>;
    }

    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderOverviewToolbar()}>
          {chat}
        </Card>
        <Card title={this._renderToolbar()} className={styles.events}>
          <Table className={styles.userTable}
                 size="middle"
                 rowKey="eventNumber"
                 columns={this._chatEventTableColumns}
                 dataSource={this.state.chatEvents.data}
                 pagination={pagination}
          />
        </Card>
      </Page>
    );
  }

  private _renderOverviewToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Chat" icon="message">
        <ToolbarButton icon="edit" tooltip="Reload Chats" onClick={this._gotoEdit} disabled={!this.state.chatInfo}/>
      </CardTitleToolbar>
    )
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Chat Events" icon="table">
        <span className={styles.search}>
          <Input placeholder="Search Chat" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <ToolbarButton icon="reload" tooltip="Reload Chats" onClick={this._loadChatEvents}/>
      </CardTitleToolbar>
    )
  }

  private _loadChatInfo = () => {
    const {domainId} = this.props;
    const chatId = this.props.match.params.id;

    const {promise, subscription} = makeCancelable(this.props.domainChatService.getChat(domainId, chatId));
    this._chatsSubscription = subscription;
    promise.then(chatInfo => {
      this._chatsSubscription = null;
      this.setState({chatInfo});
    }).catch(err => {
      console.error(err);
      this._chatsSubscription = null;
      this.setState({chatInfo: null});
    });
  }

  private _loadChatEvents = () => {
    const {domainId} = this.props;
    const chatId = this.props.match.params.id;
    const filter = this.state.searchParams.filter !== "" ? this.state.searchParams.filter : undefined;
    const offset = this.state.searchParams.page === undefined ? 0 : ((this.state.searchParams.page - 1) * this.state.searchParams.pageSize);
    const pageSize = this.state.searchParams.pageSize;
    const {promise, subscription} = makeCancelable(this.props.domainChatService.getChatEvents(domainId, chatId, offset, pageSize, filter));
    this._chatEventsSubscription = subscription;
    promise.then(chatEvents => {
      this._chatEventsSubscription = null;
      this.setState({chatEvents});
    }).catch(err => {
      console.error(err);
      this._chatEventsSubscription = null;
      this.setState({chatEvents: PagedData.EMTPY});
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

  private _parseQueryInput(urlQueryParams: string): SearchParams {
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

  private _gotoEdit = () => {
    this.props.history.push(`${this.state.chatInfo?.chatId}/edit`);
  }
}

const injections = [SERVICES.DOMAIN_CHAT_SERVICE];
export const ViewChat = injectAs<ViewChatProps>(injections, ViewChatEventsComponent);

