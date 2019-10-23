import * as React from 'react';
import {ReactNode} from 'react';
import {Page} from "../../../../components/common/Page/";
import {Card, notification} from "antd";
import styles from "./styles.module.css";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {ToolbarButton} from "../../../../components/common/ToolbarButton";
import {toDomainRoute} from "../../../../utils/domain-url";
import {ModelControls, ModelSearchMode} from "./ModelControls";
import {DomainModelService} from "../../../../services/domain/DomainModelService";
import {Model} from "../../../../models/domain/Model";
import {DomainId} from "../../../../models/DomainId";
import {PagedData} from "../../../../services/domain/common-rest-data";
import {DomainModelsTable} from './DomainModelsTable';
import queryString from 'query-string';

const emptyPage: PagedData<Model> = {data: [], startIndex: 0, totalResults: 0};

export interface SearchParams {
  queryInput?: string;
  pageSize: number;
  page: number;
  mode: ModelSearchMode;
}

export interface DomainModelsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainModelsProps {
  domainModelService: DomainModelService;
}

export interface DomainModelsState {
  loading: boolean;
  models: PagedData<Model>;
  // pageSize: number;
  // page: number;
  // columns: any[];
  // mode?: ModelSearchMode;
  // queryData?: string;
}

// Fixme this really needs to be broken up into a few classes.
/**
 * Keep this as the container component that renders the proper search mode,
 * then move the state->models into another components
 */
class DomainModelsComponent extends React.Component<InjectedProps, DomainModelsState> {
  private readonly _breadcrumbs = [{title: "Models"}];

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      models: {...emptyPage},
      loading: false,
    };

  }

  public componentDidMount(): void {
    const searchParams = this._parseQueryInput(this.props.location.search);
    this._performSearch(searchParams);
  }

  public componentDidUpdate(prevProps: InjectedProps): void {
    // check to see if the any of the searchParams changed, and perform a search if so
    const searchParams = this._parseQueryInput(this.props.location.search);
    const prevSearchParams = this._parseQueryInput(prevProps.location.search);

    if (
      searchParams.queryInput != null && (
        (prevSearchParams.queryInput != searchParams.queryInput) ||
        (searchParams.pageSize != prevSearchParams.pageSize) ||
        (searchParams.page != prevSearchParams.page)
      )
    ) {
      this._performSearch(searchParams);
    }

    if (searchParams.mode != prevSearchParams.mode) {
      this.setState({
        models: {...emptyPage}
      });
    }
  }

  public render(): ReactNode {
    const searchParams = this._parseQueryInput(this.props.location.search);

    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()} className={styles.modelCard}>
          <ModelControls
            history={this.props.history}
            searchMode={searchParams.mode}
            submittedQueryInput={searchParams.queryInput}
            domainId={this.props.domainId}
            pageSize={searchParams.pageSize}
          />
          <DomainModelsTable
            history={this.props.history}
            domainId={this.props.domainId}
            pagedModels={this.state.models}
            searchParams={searchParams}
            loading={this.state.loading}
            onDeleteConfirm={this._deleteModel}
          />
        </Card>
      </Page>
    );
  }


  private _performSearch(searchParams: SearchParams): void {
    if (searchParams.queryInput) {
      switch (searchParams.mode) {
        case ModelSearchMode.BROWSE:
          this._browse(searchParams.queryInput, searchParams.pageSize, searchParams.page);
          break;
        case ModelSearchMode.ID:
          this._lookup(searchParams.queryInput);
          break;
        case ModelSearchMode.QUERY:
          this._query(searchParams.queryInput, searchParams.pageSize);
          break;
      }
    }
  }

  private _parseQueryInput(urlQueryParams: string): SearchParams {
    let {
      mode, 
      query, 
      collection, 
      id,
      pageSize,
      page
    } = queryString.parse(urlQueryParams, {parseNumbers: true});
    let queryInput: string | undefined;
    if (mode !== undefined) {
      switch (mode) {
        case ModelSearchMode.BROWSE:
          queryInput = collection as string;
          break;
        case ModelSearchMode.ID:
          queryInput = id as string;
          break;
        case ModelSearchMode.QUERY:
          queryInput = query as string;
          break;
      }
    } else {
      mode = ModelSearchMode.BROWSE;
      queryInput = collection as string;
    }

    return {
      queryInput, 
      mode: mode as ModelSearchMode, 
      pageSize: pageSize as number || 25, 
      page: page as number || 1
    };
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Models" icon="file">
        <ToolbarButton icon="plus-circle" tooltip="Create Model" onClick={this._goToCreate}/>
      </CardTitleToolbar>
    );
  }

  private _deleteModel = (modelId: string) => {
    this.props.domainModelService
      .deleteModel(this.props.domainId, modelId)
      .then(() => {
          notification.success({
            message: "Model Deleted",
            description: `The model '${modelId}' was deleted.`
          });

          const data = this.state.models.data.filter((m: Model) => m.id !== modelId);
          const models = {
            data,
            startIndex: this.state.models.startIndex,
            totalResults: this.state.models.totalResults
          };
          this.setState({models});
        }
      )
      .catch(err => {
        console.log(err);
        notification.error({
          message: "Model Not Deleted",
          description: `Ths model could not be deleted.`
        });
      });
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-model");
    this.props.history.push(url);
  }


  private _browse = (collection: string, pageSize: number, page: number) => {
    // if (!collection) {
    //   this.setState({loading: false, models: {data: [], startIndex: 0, totalResults: 0}});
    //   return;
    // }

    // if (page === undefined) {
    //   page = 1;
    // }

    this.setState({loading: true});

    const offset = page === undefined ? 0 : ((page - 1) * pageSize);
    const query = `SELECT FROM ${collection} LIMIT ${pageSize} OFFSET ${offset}`;
    this.props.domainModelService
      .queryModels(this.props.domainId, query)
      .then(models => this.setState({models, loading: false}));
  }

  private _query = (query: string, pageSize: number) => {
    this.setState({loading: true});

    this.props.domainModelService
      .queryModels(this.props.domainId, query)
      .then(models => this.setState({models, loading: false}));
  }

  private _lookup = (id: string) => {
    this.setState({loading: true});

    this.props.domainModelService
      .getModelById(this.props.domainId, id)
      .then(model => {
        this.setState({
          models: {data: [model], totalResults: 1, startIndex: 0},
          loading: false
        });
      }, err => {
        this.setState({
          models: {...emptyPage},
          loading: false
        })
      });
  }

}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const DomainModels = injectAs<DomainModelsProps>(injections, DomainModelsComponent);
