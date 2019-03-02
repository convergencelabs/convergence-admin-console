import * as React from 'react';
import {Page} from "../../../../components/common/Page/";
import {ReactNode} from "react";
import Tooltip from "antd/es/tooltip";
import {Card, Dropdown, Menu, Table, Icon, notification, Popconfirm} from "antd";
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
import AceEditor from "react-ace";
import {longDateTime, shortDateTime, truncate} from "../../../../utils/format-utils";
import {Link} from "react-router-dom";
import {TypeChecker} from "../../../../utils/TypeChecker";
import {DomainId} from "../../../../models/DomainId";
import confirm from "antd/lib/modal/confirm";
import CopyToClipboard from "react-copy-to-clipboard";
import queryString from "query-string";
import "brace";
import 'brace/mode/json';
import 'brace/theme/solarized_dark';

export interface DomainModelsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainModelsProps {
  domainModelService: DomainModelService;
}

export interface DomainModelsState {
  loading: boolean;
  models: Model[];
  columns: any[];
  initialMode?: ModelSearchMode;
  initialData?: string;
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
      models: [],
      columns: [],
      loading: false,
      initialMode: mode as ModelSearchMode,
      initialData: data
    };

  }

  public componentDidMount(): void {
    switch (this.state.initialMode) {
      case ModelSearchMode.BROWSE:
        this._browse(this.state.initialData!, 25);
        break;
      case ModelSearchMode.ID:
        this._lookup(this.state.initialData!, 25);
        break;
      case ModelSearchMode.QUERY:
        this._query(this.state.initialData!, 25);
        break;
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
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()} className={styles.modelCard}>
          <ModelControls
            initialData={this.state.initialData}
            initialMode={this.state.initialMode}
            domainId={this.props.domainId}
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
      .queryModels(this.props.domainId, query)
      .then(models => this._updateResults(models));
  }

  private _lookup = (id: string, perPage: number) => {
    this.setState({loading: true});
    this.props.domainModelService
      .getModelById(this.props.domainId, id)
      .then(model => {
        this._updateResults([model]);
      });
  }

  private _updateResults(models: Model[]): void {
    const dataCols: Map<string, any> = new Map();
    models.forEach(model => {
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
    const permission = toDomainRoute(this.props.domainId, `models/${id}/permissions`);
    const data = toDomainRoute(this.props.domainId, `models/${id}`);
    const menu = (
      <Menu>
        <Menu.Item key="copyId">
          <CopyToClipboard text={id}>
            <span><Icon type="copy"/> Copy Id</span>
          </CopyToClipboard>
        </Menu.Item>
        <Menu.Item key="copyData">
          <CopyToClipboard text={JSON.stringify(record.data, null, "  ")}>
            <span><Icon type="copy"/> Copy Data</span>
          </CopyToClipboard>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="edit-data">
          <Link to={data}><Icon type="edit"/> Edit Model</Link>
        </Menu.Item>
        <Menu.Item key="edit-permissions">
          <Link to={permission}><Icon type="team"/> Edit Permissions</Link>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="delete">
          <span onClick={() => this._onContextDelete(id)}><Icon type="delete"/> Delete</span>
        </Menu.Item>
      </Menu>
    );

    return (
      <div style={{display: "flex", alignItems: "center"}}>
        <Tooltip title={id}>
          <Link to={data} style={{flex: 1}}>{truncate(id, 10)}</Link>
        </Tooltip>
        <Dropdown overlay={menu} trigger={['click']}>
          <Icon type="down-square"/>
        </Dropdown>
      </div>
    );
  }

  private _renderDataValue = (val: any, record: Model) => {
    return TypeChecker.switch<string>(val, {
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
  }

  private _onContextDelete = (id: string) => {
    confirm({
      title: 'Delete Model?',
      content: 'Are you sure you want to delete this model?',
      okType: 'danger',
      onOk: () => {
        this._deleteModel(id);
      }
    });
  }

  private _deleteModel = (id: string) => {
    this.props.domainModelService
      .deleteModel(this.props.domainId, id)
      .then(() => {
          notification.success({
            message: "Model Deleted",
            description: `The model '${id}' was deleted.`
          });

          const models = this.state.models.filter((m: Model) => m.id !== id);
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

  private _expander = (model: Model, index: number, indent: number, expanded: boolean) => {
    const permission = toDomainRoute(this.props.domainId, `models/${model.id}/permissions`);
    const data = toDomainRoute(this.props.domainId, `models/${model.id}`);

    return (
      <div className={styles.modelExpander}>
        <div className={styles.modelExpanderToolbar}>
          <Link to={data}><ToolbarButton icon="edit" tooltip="Edit Model"/></Link>
          <Link to={permission}><ToolbarButton icon="team" tooltip="Edit Permissions"/></Link>
          <Popconfirm title="Delete this model?" onConfirm={() => this._deleteModel(model.id)}>
            <ToolbarButton icon="delete" tooltip="Delete Model"/>
          </Popconfirm>
        </div>
        <table>
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
            <td>{longDateTime(model.created)}</td>
          </tr>
          <tr>
            <td>Modified Time:</td>
            <td>{longDateTime(model.modified)}</td>
          </tr>
          <tr>
            <td>Data:</td>
            <td>
              <div className={styles.editorContainer}>
                <AceEditor
                  className={styles.editor}
                  value={JSON.stringify(model.data, null, "  ")}
                  readOnly={true}
                  theme="solarized_dark"
                  mode="json"
                  name={"ace_" + model.id}
                  width="100%"
                  height="300px"
                  highlightActiveLine={true}
                  showPrintMargin={false}
                />
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const DomainModels = injectAs<DomainModelsProps>(injections, DomainModelsComponent);
