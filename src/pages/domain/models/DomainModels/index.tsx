import * as React from 'react';
import {ReactNode} from 'react';
import {Page} from "../../../../components/common/Page/";
import {Card, notification} from "antd";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {ToolbarButton} from "../../../../components/common/ToolbarButton";
import {toDomainRoute} from "../../../../utils/domain-url";
import {ModelControls} from "./ModelControls";
import {DomainModelService} from "../../../../services/domain/DomainModelService";
import {Model} from "../../../../models/domain/Model";
import {DomainId} from "../../../../models/DomainId";
import {DomainModelsTable} from './DomainModelsTable';
import queryString from 'query-string';
import {PagedData} from "../../../../models/PagedData";
import {ModelSearchMode} from "./ModelSearchMode";

export interface SearchParams {
  mode: ModelSearchMode;
  queryInput?: string;
  pageSize: number;
  page: number;
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
  searchParams: SearchParams;
}

const EMPTY_DATA = new PagedData<Model>([], 0, 0);

/**
 * Keep this as the container component that renders the proper search mode,
 * then move the state->models into another components
 */
class DomainModelsComponent extends React.Component<InjectedProps, DomainModelsState> {
  private readonly _breadcrumbs = [{title: "Models"}];

  constructor(props: InjectedProps) {
    super(props);

    const searchParams = this._parseQueryInput(this.props.location.search);

    this.state = {
      models: EMPTY_DATA,
      loading: false,
      searchParams
    };
  }

  public componentDidMount(): void {
    this._performSearch();
  }

  public componentDidUpdate(prevProps: InjectedProps, prevState: DomainModelsState): void {
    // Detect if the location changed. If so parse the url params and see if
    // we have different search state. If we do, then we set the state and
    // perform a search.
    if (prevProps.location.search !== this.props.location.search) {
      const searchParams = this._parseQueryInput(this.props.location.search);
      if (searchParams.mode !== this.state.searchParams.mode ||
        searchParams.pageSize !== this.state.searchParams.pageSize ||
        searchParams.page !== this.state.searchParams.page ||
        searchParams.queryInput !== this.state.searchParams.queryInput) {
        this.setState({searchParams}, () => this._performSearch());
      }
    }
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <ModelControls
            initialData={this.state.searchParams.queryInput}
            initialMode={this.state.searchParams.mode}
            domainId={this.props.domainId}
            resultsPerPageDefault={25}
            onBrowse={this._onBrowse}
            onQuery={this._onQuery}
            onIdLookup={this._onLookup}
            onModeChange={this._onModeChange}
          />
          <DomainModelsTable
            domainId={this.props.domainId}
            pagedModels={this.state.models}
            pagination={this.state.searchParams.mode === ModelSearchMode.BROWSE}
            page={this.state.searchParams.page}
            pageSize={this.state.searchParams.pageSize}
            loading={this.state.loading}
            onPageChange={this._onPageChange}
            onDeleteConfirm={this._deleteModel}
          />
        </Card>
      </Page>
    );
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

  //
  // URL Management
  //

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
      mode: mode as ModelSearchMode || ModelSearchMode.BROWSE,
      pageSize: pageSize as number || 25,
      page: page as number || 1
    };
  }

  private _pushUrl(searchParams: SearchParams): void {
    const {mode, queryInput, pageSize, page} = searchParams;
    const urlParams = new URLSearchParams();
    urlParams.set("mode", mode);
    if (queryInput) {
      switch (mode) {
        case ModelSearchMode.BROWSE:
          urlParams.set("collection", queryInput);
          if (pageSize) {
            urlParams.set("pageSize", "" + pageSize);
          }
          if (page) {
            urlParams.set("page", "" + page);
          }
          break;
        case ModelSearchMode.QUERY:
          urlParams.set("query", queryInput);
          break;
        case ModelSearchMode.ID:
          urlParams.set("id", queryInput);
          break;
      }
    }

    this.props.history.push("?" + urlParams);
  }

  private _onModeChange = (mode: ModelSearchMode) => {
    const searchParams = {...this.state.searchParams};
    delete searchParams.queryInput;

    this.setState({models: EMPTY_DATA, searchParams}, () => {
      const urlParams = new URLSearchParams();
      urlParams.set("mode", "" + mode);
      this.props.history.push("?" + urlParams);
      this._performSearch();
    });
  }

  private _onPageChange = (page: number) => {
    const searchParams = {...this.state.searchParams, page};
    this.setState({searchParams}, () => {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("page", "" + page);
      this.props.history.push("?" + urlParams);
      this._performSearch();
    })
  }

  private _onBrowse = (collection: string, pageSize: number) => {
    const searchParams: SearchParams = {
      mode: ModelSearchMode.BROWSE,
      queryInput: collection,
      pageSize: pageSize,
      page: 1
    };

    this.setState({searchParams}, () => {
      this._pushUrl(searchParams);
      this._performSearch();
    });
  }

  private _onQuery = (query: string) => {
    const searchParams: SearchParams = {
      mode: ModelSearchMode.QUERY,
      queryInput: query,
      pageSize: 25,
      page: 1
    };

    this.setState({searchParams}, () => {
      this._pushUrl(searchParams);
      this._performSearch();
    });
  }

  private _onLookup = (id: string) => {
    const searchParams: SearchParams = {
      mode: ModelSearchMode.ID,
      queryInput: id,
      pageSize: 25,
      page: 1
    };

    this.setState({searchParams}, () => {
      this._pushUrl(searchParams);
      this._performSearch();
    });
  }

  //
  // Search Execution
  //

  private _performSearch(): void {
    if (this.state.searchParams.queryInput) {
      this.setState({loading: true});

      switch (this.state.searchParams.mode) {
        case ModelSearchMode.BROWSE:
          this._browse();
          break;
        case ModelSearchMode.ID:
          this._lookup();
          break;
        case ModelSearchMode.QUERY:
          this._query();
          break;
      }
    } else {
      this.setState({loading: false, models: EMPTY_DATA});
    }
  }

  private _browse(): void {
    const {page, queryInput, pageSize} = this.state.searchParams;
    const collection = queryInput!;

    const offset = page === undefined ? 0 : ((page - 1) * pageSize);
    const query = `SELECT FROM ${collection} LIMIT ${pageSize} OFFSET ${offset}`;
    const searchParams = {...this.state.searchParams, pageSize};
    this.props.domainModelService
      .queryModels(this.props.domainId, query)
      .then(models => this.setState({models, loading: false, searchParams}));
  }

  private _query(): void {
    const query = this.state.searchParams.queryInput!;
    this.props.domainModelService
      .queryModels(this.props.domainId, query)
      .then(models => this.setState({models, loading: false}));
  }

  private _lookup(): void {
    const id = this.state.searchParams.queryInput!;

    this.props.domainModelService
      .getModelById(this.props.domainId, id)
      .then(model => {
        this.setState({
          models: {data: [model], totalResults: 1, startIndex: 0},
          loading: false
        });
      })
      .catch(err => {
        this.setState({
          models: EMPTY_DATA,
          loading: false
        })
      });
  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const DomainModels = injectAs<DomainModelsProps>(injections, DomainModelsComponent);
