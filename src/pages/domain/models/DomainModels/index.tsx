import * as React from 'react';
import {Page} from "../../../../components/Page/";
import {ReactNode} from "react";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, InputNumber, notification, Popconfirm, Select, Table} from "antd";
import styles from "./styles.module.css";
import {CartTitleToolbar} from "../../../../components/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";
import {ToolbarButton} from "../../../../components/ToolbarButton";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {toDomainUrl} from "../../../../utils/domain-url";
import {ModelControls} from "./ModelControls";
import {DomainModelService} from "../../../../services/domain/DomainModelService";
import {Model} from "../../../../models/domain/Model";
import moment from "moment";
import AceEditor from "react-ace";
import Highlight from "react-highlight";
import {shortDateTime, truncate} from "../../../../utils/format-utils";
import {Link} from "react-router-dom";
import {TypeChecker} from "../../../../utils/TypeChecker";

interface DomainModelsProps extends RouteComponentProps {
  domain: DomainDescriptor;
}

interface InjectedProps extends DomainModelsProps {
  domainModelService: DomainModelService;
}

interface ServerCollectionsState {
  loading: boolean;
  models: Model[];
  columns: any[];
  mode: SearchMode;
}

type SearchMode = "browse" | "query" | "id";

class DomainModelsComponent extends React.Component<InjectedProps, ServerCollectionsState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private readonly _metaColumns: any[];

  constructor(props: InjectedProps) {
    super(props);
    this._breadcrumbs = new DomainBreadcrumbProducer([{title: "Models"}]);
    this.state = {
      models: [],
      columns: [],
      mode: "browse",
      loading: false
    };

    this._metaColumns = [{
      title: 'Id',
      dataIndex: 'id',
      width: 100,
      fixed: 'left',
      sorter: (a: Model, b: Model) => (a.id as string).localeCompare(b.id),
      render: (id: string, record: Model) => <Tooltip title={id}><Link to={""}>{truncate(id, 10)}</Link></Tooltip>
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
  }

  private _renderToolbar(): ReactNode {
    return (
      <CartTitleToolbar title="Models" icon="file">
        <span className={styles.search}></span>
        <ToolbarButton icon="plus-circle" tooltip="Create Model" onClick={this._goToCreate}/>
      </CartTitleToolbar>
    )
  }

  private _goToCreate = () => {
    const url = toDomainUrl("", this.props.domain.toDomainId(), "create-model");
    this.props.history.push(url);
  }

  public render(): ReactNode {
    this._breadcrumbs.setDomain(this.props.domain);

    return (
      <Page breadcrumbs={this._breadcrumbs.breadcrumbs()}>
        <Card title={this._renderToolbar()}>
          <ModelControls
            domainId={this.props.domain.toDomainId()}
            resultsPerPageDefault={25}
            onBrowse={this._browse}
            onQuery={this._query}
            onIdLookup={this._lookup}
          />
          <Table columns={this.state.columns}
                 size="middle"
                 rowKey="id"
                 bordered={true}
                 loading={this.state.loading}
                 dataSource={this.state.models}
                 expandedRowRender={this._expander}
          />
        </Card>
      </Page>
    );
  }

  private _browse = (collection: string, perPage: number) => {
    const query = `SELECT FROM ${collection} LIMIT ${perPage} OFFSET ${0}`;
    this._query(query, perPage);
  }

  private _query = (query: string, perPage: number) => {
    if (query.endsWith(";")) {
      query = query.substring(0, query.length - 1);
    }

    this.setState({loading: true});
    this.props.domainModelService
      .queryModels(this.props.domain.toDomainId(), query)
      .then(models => this._updateResults(models));
  }

  private _lookup = (id: string, perPage: number) => {
    this.setState({loading: true});
    this.props.domainModelService
      .getModelById(this.props.domain.toDomainId(), id)
      .then(model => {
        this._updateResults([model]);
      });
  }

  private _updateResults(models: Model[]): void {
    const dataCols: Map<string, any> = new Map();
    models.forEach(model => {
      const data = model.data;
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

  private _renderDataValue = (val: any, record: Model) => {
    return TypeChecker.switch<string>(val,{
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
      }
    });
  }

  private _expander = (model: Model, index: number, indent: number, expanded: boolean) => {
    return (
      <table className={styles.modelExpander}>
        <tbody>
        <tr>
          <td>Id:</td>
          <td>{model.id}</td>
        </tr>
        <tr>
          <td>Collection:</td>
          <td>{model.collection}</td>
        </tr>
        <tr>
          <td>Version:</td>
          <td>{model.version}</td>
        </tr>
        <tr>
          <td>Created Time:</td>
          <td>{moment(model.created).format("MM/DD @ hh:mm")}</td>
        </tr>
        <tr>
          <td>Modified Time:</td>
          <td>{moment(model.modified).format("MM/DD @ hh:mm")}</td>
        </tr>
        <tr>
          <td>Data:</td>
          <td>
            <Highlight className={"JavaScript"}>{JSON.stringify(model.data, null, "  ")}</Highlight>
          </td>
        </tr>
        </tbody>
      </table>
    );

  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const DomainModels = injectAs<DomainModelsProps>(injections, DomainModelsComponent);

