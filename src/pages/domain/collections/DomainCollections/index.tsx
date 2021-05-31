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
  EyeOutlined, FolderOutlined, PlusCircleOutlined,
  QuestionCircleOutlined, ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {Button, Card, Input, notification, Popconfirm, Table, TablePaginationConfig} from "antd";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainCollectionService} from "../../../../services/domain/DomainCollectionService";
import {DomainId} from "../../../../models/DomainId";
import {CollectionSummary} from "../../../../models/domain/CollectionSummary";
import {ToolbarButton} from "../../../../components/common/ToolbarButton";
import {toDomainRoute} from "../../../../utils/domain-url";
import styles from "./styles.module.css";
import {PagedData} from "../../../../models/PagedData";
import {appendToQueryParamString} from "../../../../utils/router-utils";
import queryString from "query-string";

export interface SearchParams {
  filter?: string;
  pageSize: number;
  page: number;
}

export interface DomainCollectionsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainCollectionsProps {
  domainCollectionService: DomainCollectionService;
}

export interface DomainCollectionsState {
  collections: PagedData<CollectionSummary>;
  searchParams: SearchParams;
}

class DomainCollectionsComponent extends React.Component<InjectedProps, DomainCollectionsState> {
  private readonly _breadcrumbs = [{title: "Collections"}];
  private readonly _collectionTableColumns: any[];
  private _collectionsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._collectionTableColumns = [{
      title: 'Id',
      dataIndex: 'id',
      sorter: (a: CollectionSummary, b: CollectionSummary) => (a.id as string).localeCompare(b.id),
      render: (text: string) => <Link to={toDomainRoute(this.props.domainId, `collections/${text}`)}>{text}</Link>
    }, {
      title: 'Models',
      dataIndex: 'modelCount',
      align: 'right',
      width: 100,
      sorter: (a: CollectionSummary, b: CollectionSummary) => a.modelCount - b.modelCount
    }, {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: CollectionSummary, b: CollectionSummary) => (a.description as string).localeCompare(b.description)
    }, {
      title: '',
      align: 'right',
      width: 110,
      render: this._renderActions
    }];

    this._collectionsSubscription = null;

    const searchParams = this._parseQueryInput(this.props.location.search);

    this.state = {
      collections: new PagedData<CollectionSummary>([], 0, 0),
      searchParams
    };
  }

  public componentDidMount(): void {
    this._loadCollections();
  }

  public componentWillUnmount(): void {
    if (this._collectionsSubscription) {
      this._collectionsSubscription.unsubscribe();
      this._collectionsSubscription = null;
    }
  }

  public componentDidUpdate(prevProps: InjectedProps, prevState: DomainCollectionsState): void {
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
      this._loadCollections();
    }
  }

  public render(): ReactNode {
    const pagination: TablePaginationConfig = {
      pageSize: this.state.searchParams.pageSize,
      current: this.state.searchParams.page,
      total: this.state.collections.totalResults,
      onChange: this._pageChange,
      showTotal: (total: number) => `${total} total results`
    };

    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 size="middle"
                 rowKey="id"
                 columns={this._collectionTableColumns}
                 dataSource={this.state.collections.data}
                 pagination={pagination}
          />
        </Card>
      </Page>
    );
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Collections" icon={<FolderOutlined />}>
        <span className={styles.search}>
          <Input placeholder="Search Collections"
                 addonAfter={<SearchOutlined />}
                 onInput={this._onFilterChange}
                 value={this.state.searchParams.filter}
          />
        </span>
        <ToolbarButton icon={<PlusCircleOutlined />} tooltip="Create Collection" onClick={this._goToCreate}/>
        <ToolbarButton icon={<ReloadOutlined />} tooltip="Reload Collections" onClick={this._loadCollections}/>
      </CardTitleToolbar>
    );
  }

  private _renderActions = (_: undefined, record: CollectionSummary) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Browse Collection" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `models/?mode=browse&collection=${record.id}`)}>
            <Button shape="circle" size="small" htmlType="button" icon={<EyeOutlined />}/>
          </Link>
        </Tooltip>
        <Tooltip placement="topRight" title="Edit Collection" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `collections/${record.id}`)}>
            <Button shape="circle" size="small" htmlType="button" icon={<EditOutlined />}/>
          </Link>
        </Tooltip>
         <Popconfirm title="Are you sure delete this collection?"
                     placement="topRight"
                     onConfirm={() => this._onDeleteCollection(record.id)}
                     okText="Yes"
                     cancelText="No"
                     icon={<QuestionCircleOutlined style={{color: 'red'}} />}
         >
        <Tooltip placement="topRight" title="Delete Collection" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button"><DeleteOutlined /></Button>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _onDeleteCollection = (collectionId: string) => {
    this.props.domainCollectionService.deleteCollection(this.props.domainId, collectionId)
      .then(() => {
        this._loadCollections();
        notification.success({
          message: 'Collection Deleted',
          description: `The collection '${collectionId}' was deleted.`,
        });
      })
      .catch(() => {
        notification.error({
          message: 'Could Not Delete Collection',
          description: `The collection could not be deleted.`,
        });
      });
  }

  private _loadCollections = () => {
    const domainId = this.props.domainId;
    const filter = this.state.searchParams.filter !== "" ? this.state.searchParams.filter : undefined;
    const offset = this.state.searchParams.page === undefined ? 0 : ((this.state.searchParams.page - 1) * this.state.searchParams.pageSize);
    const {promise, subscription} = makeCancelable(
      this.props.domainCollectionService.getCollectionSummaries(domainId, filter, offset, this.state.searchParams.pageSize));
    this._collectionsSubscription = subscription;
    promise.then(collections => {
      this._collectionsSubscription = null;
      this.setState({collections});
    }).catch(err => {
      console.error(err);
      this._collectionsSubscription = null;
      this.setState({collections: new PagedData<CollectionSummary>([], 0, 0)});
    });
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-collection");
    this.props.history.push(url);
  }

  private _pageChange = (page: number, pageSize?: number) => {
    pageSize = pageSize || this.state.searchParams.pageSize;
    let newUrl = appendToQueryParamString({page, pageSize});
    this.props.history.push(newUrl);
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    // todo debounce
    const filter = (event.target as HTMLInputElement).value;
    let newUrl = appendToQueryParamString({filter, page: 1, pageSize: this.state.searchParams.pageSize});
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
}

const injections = [SERVICES.DOMAIN_COLLECTION_SERVICE];
export const DomainCollections = injectAs<DomainCollectionsProps>(injections, DomainCollectionsComponent);
