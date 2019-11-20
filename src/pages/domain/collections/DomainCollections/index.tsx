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
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, notification, Popconfirm, Table} from "antd";
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
import {PaginationConfig} from "antd/lib/pagination";
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
}

class DomainCollectionsComponent extends React.Component<InjectedProps, DomainCollectionsState> {
  private readonly _breadcrumbs =[{title: "Collections"}];
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

    this.state = {
      collections: new PagedData<CollectionSummary>([], 0, 0),
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

  public componentDidUpdate(prevProps: InjectedProps): void {
    // check to see if the any of the searchParams changed, and perform a search if so
    const searchParams = this._parseQueryInput(this.props.location.search);
    const prevSearchParams = this._parseQueryInput(prevProps.location.search);

    if (searchParams.filter !== null &&
      ((prevSearchParams.filter !== searchParams.filter) ||
        (searchParams.pageSize !== prevSearchParams.pageSize) ||
        (searchParams.page !== prevSearchParams.page))
    ) {
      this._loadCollections();
    }
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Collections" icon="folder">
        <span className={styles.search}>
          <Input placeholder="Search Collections"
                 addonAfter={<Icon type="search"/>}
                 onKeyUp={this._onFilterChange}/>
        </span>
        <ToolbarButton icon="plus-circle" tooltip="Create Collection" onClick={this._goToCreate}/>
        <ToolbarButton icon="reload" tooltip="Reload Collections" onClick={this._loadCollections}/>
      </CardTitleToolbar>
    )
  }

  public render(): ReactNode {
    const searchParams = this._parseQueryInput(this.props.location.search);

    const pagination: PaginationConfig  = {
      pageSize: searchParams.pageSize,
      current: searchParams.page,
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

  private _renderActions = (_: undefined, record: CollectionSummary) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Browse Collection" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `models/?mode=browse&collection=${record.id}`)}>
            <Button shape="circle" size="small" htmlType="button" icon="eye"/>
          </Link>
        </Tooltip>
        <Tooltip placement="topRight" title="Edit Collection" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `collections/${record.id}`)}>
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

  private _onDeleteCollection = (collectionId: string) => {
    this.props.domainCollectionService.deleteCollection(this.props.domainId, collectionId)
      .then(() => {
        this._loadCollections();
        notification.success({
          message: 'Collection Deleted',
          description: `The collection '${collectionId}' was deleted.`,
        });
      })
      .catch(err => {
        notification.error({
          message: 'Could Not Delete Collection',
          description: `The collection could not be deleted.`,
        });
      });
  }

  private _loadCollections = () => {
    const searchParams = this._parseQueryInput(this.props.location.search);
    const domainId = this.props.domainId;
    const filter = searchParams.filter !== "" ? searchParams.filter : undefined;
    const offset = searchParams.page === undefined ? 0 : ((searchParams.page - 1) * searchParams.pageSize);
    const {promise, subscription} = makeCancelable(
      this.props.domainCollectionService.getCollectionSummaries(domainId, filter, offset, searchParams.pageSize));
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

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    let {
      pageSize
    } = queryString.parse(this.props.location.search, {parseNumbers: true});

    // todo debounce
    const filter = (event.target as HTMLInputElement).value;
    let newUrl = appendToQueryParamString({filter, page: 1, pageSize: pageSize as string});
    this.props.history.push(newUrl);
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-collection");
    this.props.history.push(url);
  }

  private _pageChange = (page: number, pageSize?: number) => {
    let newUrl = appendToQueryParamString({page, pageSize});
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

