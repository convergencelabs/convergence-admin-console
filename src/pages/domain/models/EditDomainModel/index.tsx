import {Page} from "../../../../components/common/Page/";
import React, {ReactNode} from "react";
import {Card, notification, Popconfirm, Tabs} from "antd";
import {Icon} from 'antd';
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {DomainModelService} from "../../../../services/domain/DomainModelService";
import {ModelEditorTab} from "./ModelEditorTab/";
import {ModelPermissionsTab} from "./ModelPermissionsTab";
import {ToolbarButton} from "../../../../components/common/ToolbarButton";
import {DomainId} from "../../../../models/DomainId";
import {toDomainUrl} from "../../../../utils/domain-url";

interface EditDomainModelRouteProps {
  id: string;
  tab: string;
}

interface EditDomainModelProps extends RouteComponentProps<EditDomainModelRouteProps> {
  domainId: DomainId;
}

interface InjectedProps extends EditDomainModelProps {
  domainModelService: DomainModelService;
}

class EditDomainModelComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;

  constructor(props: InjectedProps) {
    super(props);

    const id = this.props.match.params.id;

    const modelsUrl = toDomainUrl("", this.props.domainId, "models");
    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [
      {title: "Models", link: modelsUrl},
      {title: id}
    ]);
  }

  public render(): ReactNode {
    const id = this.props.match.params.id;
    const tab = this.props.match.params.tab || "data";
    const baseUrl = toDomainUrl("", this.props.domainId, `models/${id}`);
    return (
      <Page breadcrumbs={this._breadcrumbs} full={true}>
        <Card title={this._renderTitle()} className={styles.formCard}>
          <Tabs className={styles.tabs}
                type="card"
                defaultActiveKey={tab}
                onChange={key => {
                  this.props.history.push(`${baseUrl}/${key}`);
                }}
          >
            <Tabs.TabPane tab="Data" key="data">
              <ModelEditorTab modelId={id}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Permissions" key="permissions">
              <ModelPermissionsTab
                domainId={this.props.domainId}
                modelId={id}
              />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Page>
    );
  }

  private _renderTitle = () => {
    return (
      <span className={styles.title}>
        <span className={styles.editTitle}>
          <Icon type="file"/>
          <span> Edit Model</span>
        </span>
        <span className={styles.modelAndCollection}>
          <span className={styles.modelId}>{this.props.match.params.id}</span>
          <span className={styles.collectionId}><Icon className={styles.collectionIcon} type="folder"/>{"collection"}</span>
        </span>
        <span className={styles.spacer}/>
        <Popconfirm title="Delete this model?" onConfirm={this._onDeleteModel} placement="bottomRight">
          <ToolbarButton icon="delete" tooltip="Delete Model"/>
        </Popconfirm>
      </span>
    );
  }

  private _onDeleteModel = () => {
    this.props.domainModelService
      .deleteModel(this.props.domainId, this.props.match.params.id)
      .then( () => {
          notification.success({
            message: "Model Deleted",
            description: `The model '${this.props.match.params.id}' was deleted.`
          });

          this.props.history.push(toDomainUrl("", this.props.domainId, "models"));
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
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const EditDomainModel = injectAs<EditDomainModelProps>(injections, EditDomainModelComponent);
