import * as React from 'react';
import {Page} from "../../../../components/Page/";
import {KeyboardEvent, ReactNode} from "react";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, notification, Popconfirm, Table} from "antd";
import styles from "./styles.module.css";
import {CartTitleToolbar} from "../../../../components/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainCollectionService} from "../../../../services/domain/DomainCollectionService";
import {DomainRouteParams} from "../../DomainRouteParams";
import {DomainId} from "../../../../models/DomainId";
import {CollectionSummary} from "../../../../models/domain/CollectionSummary";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";
import {ToolbarButton} from "../../../../components/ToolbarButton";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";

interface DomainCollectionsProps extends RouteComponentProps<DomainRouteParams> {
  domain: DomainDescriptor;
}

interface InjectedProps extends DomainCollectionsProps {
  domainCollectionService: DomainCollectionService;
}

interface ServerCollectionsState {
  collections: CollectionSummary[] | null;
  collectionFilter: string;
}

export class DomainCollectionsComponent extends React.Component<InjectedProps, ServerCollectionsState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private readonly _collectionTableColumns: any[];
  private _collectionsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._breadcrumbs = new DomainBreadcrumbProducer([{title: "DomainCollections"}]);
    this._collectionTableColumns = [{
      title: 'Id',
      dataIndex: 'id',
      sorter: (a: any, b: any) => (a.username as string).localeCompare(b.username),
      render: (text: string) => <Link to={`/users/${text}`}>{text}</Link>
    }, {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: any, b: any) => (a.displayName as string).localeCompare(b.displayName)
    }, {
      title: 'No. Models',
      dataIndex: 'modelCount',
      align: 'right',
      sorter: (a: any, b: any) => (a.email as string).localeCompare(b.email)
    }, {
      title: '',
      align: 'right',
      width: 80,
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
      <CartTitleToolbar title="Collections" icon="folder">
        <span className={styles.search}>
          <Input placeholder="Search Collections" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <ToolbarButton icon="plus-circle" tooltip="Create Collection" onClick={this._goToCreate}/>
        <ToolbarButton icon="reload" tooltip="Reload Collections" onClick={this._loadCollections}/>
      </CartTitleToolbar>
    )
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({collectionFilter: (event.target as HTMLInputElement).value}, this._loadCollections);
  }

  private _goToCreate = () => {
    this.props.history.push(`/domain/${this.props.domain.namespace}/${this.props.domain.id}/create-collection`);
  }

  public render(): ReactNode {
    this._breadcrumbs.setDomain(this.props.domain);
    return (
      <Page breadcrumbs={this._breadcrumbs.breadcrumbs()}>
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

  private _renderActions = (value: CollectionSummary, record: CollectionSummary) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit Collection" mouseEnterDelay={1}>
          <Link to={`/collections/${value.id}`}>
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
    const domainId = new DomainId(this.props.domain.namespace, this.props.domain.id);
    this.props.domainCollectionService.deleteCollection(domainId, collectionId)
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
    const domainId = new DomainId(this.props.domain.namespace, this.props.domain.id);
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

