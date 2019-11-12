/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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

export interface DomainCollectionsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainCollectionsProps {
  domainCollectionService: DomainCollectionService;
}

export interface DomainCollectionsState {
  collections: CollectionSummary[] | null;
  collectionFilter: string;
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
      collections: null,
      collectionFilter: ""
    };

    this._loadCollections();
  }

  public componentWillUnmount(): void {
    if (this._collectionsSubscription) {
      this._collectionsSubscription.unsubscribe();
      this._collectionsSubscription = null;
    }
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Collections" icon="folder">
        <span className={styles.search}>
          <Input placeholder="Search Collections" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <ToolbarButton icon="plus-circle" tooltip="Create Collection" onClick={this._goToCreate}/>
        <ToolbarButton icon="reload" tooltip="Reload Collections" onClick={this._loadCollections}/>
      </CardTitleToolbar>
    )
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({collectionFilter: (event.target as HTMLInputElement).value}, this._loadCollections);
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-collection");
    this.props.history.push(url);
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 size="middle"
                 rowKey="id"
                 columns={this._collectionTableColumns}
                 dataSource={this.state.collections || []}
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
    const domainId = this.props.domainId;
    const filter = this.state.collectionFilter !== "" ? this.state.collectionFilter : undefined;
    const {promise, subscription} = makeCancelable(this.props.domainCollectionService.getCollectionSummaries(domainId, filter));
    this._collectionsSubscription = subscription;
    promise.then(collections => {
      this._collectionsSubscription = null;
      this.setState({collections});
    }).catch(err => {
      console.error(err);
      this._collectionsSubscription = null;
      this.setState({collections: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_COLLECTION_SERVICE];
export const DomainCollections = injectAs<DomainCollectionsProps>(injections, DomainCollectionsComponent);

