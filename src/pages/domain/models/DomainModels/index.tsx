import * as React from 'react';
import {ReactNode} from 'react';
import {Page} from "../../../../components/common/Page/";
import Tooltip from "antd/es/tooltip";
import {Card, notification, Table} from "antd";
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
import moment from "moment";
import {longDateTime, shortDateTime, truncate} from "../../../../utils/format-utils";
import {Link} from "react-router-dom";
import {TypeChecker} from "../../../../utils/TypeChecker";
import {DomainId} from "../../../../models/DomainId";
import queryString from "query-string";
import "brace";
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import {PagedData} from "../../../../services/domain/common-rest-data";
import { ModelDropdownMenu } from './ModelDropdownMenu';
import { ModelRowExpandedComponent } from './ModelRowExpanded';

export interface DomainModelsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainModelsProps {
  domainModelService: DomainModelService;
}

export interface DomainModelsState {
  loading: boolean;
  models: PagedData<Model>;
  pageSize: number;
  page: number;
  columns: any[];
  mode?: ModelSearchMode;
  queryData?: string;
}

// Fixme this really needs to be broken up into a few classes.
class DomainModelsComponent extends React.Component<InjectedProps, DomainModelsState> {
  private readonly _breadcrumbs = [{title: "Models"}];
  private readonly _metaColumns: any[];

  constructor(props: InjectedProps) {
    super(props);

    this._metaColumns = [{
      title: 'Id',
      dataIndex: 'id',
      width: 120,
      sorter: (a: Model, b: Model) => (a.id as string).localeCompare(b.id),
      render: this._renderMenu
    }, {
      title: 'Version',
      dataIndex: 'version',
      width: 100,
      sorter: true,
      align: "right"
    }, {
      title: 'Modified',
      dataIndex: 'modified',
      width: 180,
      render: (val: Date, record: Model) => shortDateTime(val),
      sorter: (a: Model, b: Model) => a.modified.getTime() - b.modified.getTime()
    }];

    const {mode, query, collection, id} = queryString.parse(this.props.location.search);
    let data: string | undefined;
    if (mode !== undefined) {
      switch (mode) {
        case ModelSearchMode.BROWSE:
          data = collection as string;
          break;
        case ModelSearchMode.ID:
          data = id as string;
          break;
        case ModelSearchMode.QUERY:
          data = query as string;
          break;
      }
    }

    this.state = {
      pageSize: 25,
      page: 1,
      models: {data: [], startIndex: 0, totalResults: 0},
      columns: [],
      loading: false,
      mode: mode as ModelSearchMode,
      queryData: data
    };

  }

  public componentDidMount(): void {
    if (this.state.queryData) {
      switch (this.state.mode) {
        case ModelSearchMode.BROWSE:
          this._browse(this.state.queryData, this.state.pageSize, 1);
          break;
        case ModelSearchMode.ID:
          this._lookup(this.state.queryData);
          break;
        case ModelSearchMode.QUERY:
          this._query(this.state.queryData, this.state.pageSize);
          break;
      }
    }
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Models" icon="file">
        <ToolbarButton icon="plus-circle" tooltip="Create Model" onClick={this._goToCreate}/>
      </CardTitleToolbar>
    );
  }


  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-model");
    this.props.history.push(url);
  }

  public render(): ReactNode {
    const pagination = this.state.mode === ModelSearchMode.BROWSE ? {
      pageSize: this.state.pageSize,
      current: this.state.page,
      total: this.state.models.totalResults,
      onChange: this._pageChange,
      showTotal: (total: number) => `${total} total results`
    } : false;

    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()} className={styles.modelCard}>
          <ModelControls
            initialData={this.state.queryData}
            initialMode={this.state.mode}
            domainId={this.props.domainId}
            resultsPerPageDefault={25}
            onBrowse={this._browse}
            onQuery={this._query}
            onIdLookup={this._lookup}
            onModeChange={this._modeChange}
          />
          <Table columns={this.state.columns}
                 size="middle"
                 rowKey="id"
                 bordered={true}
                 loading={this.state.loading}
                 dataSource={this.state.models.data}
                 expandedRowRender={this._expander}
                 pagination={pagination}
          />
        </Card>
      </Page>
    );
  }

  private _pageChange = (page: number, pageSize?: number) => {
    this.setState({page});

    if (this.state.mode === ModelSearchMode.BROWSE) {
      this._browse(this.state.queryData!, this.state.pageSize, page)
    }
  }

  private _modeChange = (mode: ModelSearchMode) => {
    this.props.history.push(this.props.location.pathname, {
      mode, queryData: "", models: {data: [], totalResults: 0, startIndex: 0}
    });
    // this.setState({mode, queryData: "", models: {data: [], totalResults: 0, startIndex: 0}});
  }

  private _browse = (collection: string, pageSize: number, page?: number) => {
    if (!collection) {
      this.setState({loading: false, pageSize, models: {data: [], startIndex: 0, totalResults: 0}});
      return;
    }

    if (page === undefined) {
      page = 1;
    }

    this.setState({loading: true, queryData: collection, pageSize, page, mode: ModelSearchMode.BROWSE});

    const offset = page === undefined ? 0 : ((page - 1) * pageSize);
    const query = `SELECT FROM ${collection} LIMIT ${pageSize} OFFSET ${offset}`;
    this.props.domainModelService
      .queryModels(this.props.domainId, query)
      .then(models => this._updateResults(models));
  }

  private _query = (query: string, pageSize: number) => {
    if (!query) {
      this.setState({loading: false, pageSize, models: {data: [], startIndex: 0, totalResults: 0}});
      return;
    }

    if (query.endsWith(";")) {
      query = query.substring(0, query.length - 1);
    }

    this.setState({loading: true, pageSize, queryData: query});
    this.props.domainModelService
      .queryModels(this.props.domainId, query)
      .then(models => this._updateResults(models));
  }

  private _lookup = (id: string) => {
    if (!id) {
      this.setState({loading: false, pageSize: 1, models: {data: [], startIndex: 0, totalResults: 0}});
      return;
    }

    this.setState({loading: true, pageSize: 1, queryData: id});
    this.props.domainModelService
      .getModelById(this.props.domainId, id)
      .then(model => {
        // FIXME check for a null model.
        this._updateResults({data: [model], totalResults: 1, startIndex: 0});
      });
  }

  private _updateResults(models: PagedData<Model>): void {
    const dataCols: Map<string, any> = new Map();
    models.data.forEach(model => {
      const data = model.data!;
      Object.keys(data).forEach(key => {
        dataCols.set(key, typeof data[key]);
      });
    });

    const columns: any[] = this._metaColumns.slice(0);
    dataCols.forEach((type, column) => {
      columns.push({
        title: column,
        dataIndex: `data.${column}`,
        render: this._renderDataValue
      });
    });
    this.setState({models, columns, loading: false});
  }

  private _renderMenu = (id: string, record: Model) => {
    const data = toDomainRoute(this.props.domainId, `models/${id}`);
    return (
      <div style={{display: "flex", alignItems: "center"}}>
        <Tooltip title={id}>
          <Link to={data} style={{flex: 1}}>{truncate(id, 10)}</Link>
        </Tooltip>
        <ModelDropdownMenu id={id} record={record} domainId={this.props.domainId} onDeleteConfirm={this._deleteModel} />
      </div>
    );
  }

  private _renderDataValue = (val: any, record: Model) => {
    const renderedValue = TypeChecker.switch<string>(val, {
      null() {
        return "null";
      },
      string(val: string) {
        return val;
      },
      date(val: Date) {
        return moment(val).format();
      },
      undefined() {
        return "";
      },
      object(obj: any) {
        return JSON.stringify(obj);
      },
      array(arr: any[]) {
        return JSON.stringify(arr);
      },
      number(val: number) {
        return val + ""
      },
      boolean(val: boolean) {
        return val + ""
      },
      custom: [
        {
          test(value: any): boolean {
            return TypeChecker.isObject(value) && value["$$convergence_type"] === "date";
          },
          callback(value: any): string {
            const longDate = value["date"];
            const date = new Date(longDate);
            return longDateTime(date);
          }
        }
      ]
    });

    return (<div className={styles.dataValue}>{renderedValue}</div>);
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

  private _expander = (model: Model) => {
    return <ModelRowExpandedComponent record={model} domainId={this.props.domainId} onDeleteConfirm={this._deleteModel} />;
  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const DomainModels = injectAs<DomainModelsProps>(injections, DomainModelsComponent);
