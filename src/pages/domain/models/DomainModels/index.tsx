import * as React from 'react';
import {Page} from "../../../../components/Page/";
import {KeyboardEvent, ReactNode} from "react";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, InputNumber, notification, Popconfirm, Select} from "antd";
import styles from "./styles.module.css";
import {CartTitleToolbar} from "../../../../components/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainCollectionService} from "../../../../services/domain/DomainCollectionService";
import {DomainId} from "../../../../models/DomainId";
import {CollectionSummary} from "../../../../models/domain/CollectionSummary";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";
import {ToolbarButton} from "../../../../components/ToolbarButton";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {toDomainUrl} from "../../../../utils/domain-url";
import {CollectionAutoComplete} from "../../../../components/CollectionAutoComplete";

const {Option} = Select;

interface DomainModelsProps extends RouteComponentProps {
  domain: DomainDescriptor;
}

interface InjectedProps extends DomainModelsProps {
  domainCollectionService: DomainCollectionService;
}

interface ServerCollectionsState {
  collections: CollectionSummary[] | null;
  collectionFilter: string;
  mode: SearchMode
}

type SearchMode = "browse" | "query" | "id"

class DomainModelsComponent extends React.Component<InjectedProps, ServerCollectionsState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;

  constructor(props: InjectedProps) {
    super(props);
    this._breadcrumbs = new DomainBreadcrumbProducer([{title: "Models"}]);
    this.state = {
      collections: null,
      collectionFilter: "",
      mode: "browse"
    };
  }

  private _renderToolbar(): ReactNode {
    return (
      <CartTitleToolbar title="Models" icon="file">
        <span className={styles.search}></span>
        <ToolbarButton icon="plus-circle" tooltip="Create Collection" onClick={this._goToCreate}/>
        <ToolbarButton icon="reload" tooltip="Reload Collections" onClick={() => {
        }}/>
      </CartTitleToolbar>
    )
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({collectionFilter: (event.target as HTMLInputElement).value});
  }

  private _goToCreate = () => {
    const url = toDomainUrl("", this.props.domain.toDomainId(), "create-collection");
    this.props.history.push(url);
  }

  public render(): ReactNode {
    this._breadcrumbs.setDomain(this.props.domain);
    return (
      <Page breadcrumbs={this._breadcrumbs.breadcrumbs()}>
        <Card title={this._renderToolbar()}>
          <div className={styles.toolbar}>
            <div className={styles.modeSelector}>
              <span>Mode: </span>
              <Select style={{width: 150}}
                      value={this.state.mode}
                      onChange={this._changeMode}>
                <Option key="browse">Browse</Option>
                <Option key="query">Query</Option>
                <Option key="id">Id Lookup</Option>
              </Select>
            </div>
            <div className={styles.controls}>
              {this._renderControls()}
            </div>
          </div>
        </Card>
      </Page>
    );
  }

  private _changeMode = (val: SearchMode, option: any) => {
    this.setState({mode: val});
  }

  private _renderControls(): ReactNode {
    switch (this.state.mode) {
      case "browse":
        return this._browse();
      case "query":
        return this._query();
      case "id":
        return this._byId();
    }
  }

  private _browse(): ReactNode {
    return (
      <React.Fragment>
        <span>Collection: </span>
        <CollectionAutoComplete className={styles.collection} domainId={this.props.domain.toDomainId()}/>
        <span>Results Per Page: </span>
        <InputNumber/>
        <Button htmlType="button" type="primary">Browse</Button>
      </React.Fragment>
    )
  }

  private _query(): ReactNode {
    return (
      <React.Fragment>
        <span>Query: </span>
        <Input placeholder="Enter Query"/>
        <Button htmlType="button" type="primary">Search</Button>
      </React.Fragment>
    )
  }

  private _byId(): ReactNode {
    return (
      <React.Fragment>
        <span>Model Id: </span>
        <Input placeholder="Enter Model Id"/>
        <Button htmlType="button" type="primary">Lookup</Button>
      </React.Fragment>
    )
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
        //this._loadCollections();
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

}

const injections = [SERVICES.DOMAIN_COLLECTION_SERVICE];
export const DomainModels = injectAs<DomainModelsProps>(injections, DomainModelsComponent);

