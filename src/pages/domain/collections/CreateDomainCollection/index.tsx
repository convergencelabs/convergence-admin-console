import React, {ReactNode} from "react";
import {
  Card,
  notification,
  Form,
  Icon
} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {RouteComponentProps} from "react-router";
import {Page} from "../../../../components/common/Page/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {DomainCollectionService} from "../../../../services/domain/DomainCollectionService";
import {Collection} from "../../../../models/domain/Collection";
import {toDomainRoute} from "../../../../utils/domain-url";
import {DomainId} from "../../../../models/DomainId";
import {DomainCollectionForm} from "../../../../components/domain/collection/DomainCollectionForm";
import {CollectionPermissions} from "../../../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../../../models/domain/ModelSnapshotPolicy";
import styles from "./styles.module.css";

export interface CreateDomainCollectionsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends CreateDomainCollectionsProps, FormComponentProps {
  domainCollectionService: DomainCollectionService;
}

class CreateDomainCollectionComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Collection", link: "/collections"},
    {title: "New Collection"}
  ];
  private readonly _newCollection: Collection;

  constructor(props: InjectedProps) {
    super(props);

    this._newCollection = new Collection(
      "",
      "",
      new CollectionPermissions(true, true, true, true, false),
      false,
      new ModelSnapshotPolicy(
        false,
        false,
        0,
        false,
        0,
        false,
        0 ,
        false,
        0)
    );
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="folder"/> New Collection</span>} className={styles.formCard}>
          <DomainCollectionForm
            saveButtonLabel="Create"
            initialValue={this._newCollection}
            onCancel={this._handleCancel}
            onSave={this._handleSave}
          />
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    const url = toDomainRoute(this.props.domainId, "collections/");
    this.props.history.push(url);
  }

  private _handleSave = (collection: Collection) => {
    const domainId = this.props.domainId;
    this.props.domainCollectionService.createCollection(domainId, collection)
      .then(() => {
        notification.success({
          message: 'Collection Created',
          description: `Collection '${collection.id}' successfully created`
        });
        const url = toDomainRoute(domainId, "collections/");
        this.props.history.push(url);
      }).catch((err) => {
      if (err instanceof RestError) {
        if (err.code === "duplicate") {
          notification.error({
            message: 'Could Not Create Collection',
            description: `A collection with the specified ${err.details["field"]} already exists.`
          });
        }
      }
    });
  }
}

const injections = [SERVICES.DOMAIN_COLLECTION_SERVICE];
export const CreateDomainCollection = injectAs<CreateDomainCollectionsProps>(injections, Form.create<{}>()(CreateDomainCollectionComponent));
