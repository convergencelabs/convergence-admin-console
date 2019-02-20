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
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {DomainCollectionService} from "../../../../services/domain/DomainCollectionService";
import {Collection} from "../../../../models/domain/Collection";
import {toDomainUrl} from "../../../../utils/domain-url";
import {DomainId} from "../../../../models/DomainId";
import {DomainCollectionForm} from "../../../../components/domain/collection/DomainCollectionForm";
import styles from "./styles.module.css";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";

export interface EditDomainCollectionsProps extends RouteComponentProps<{ id: string }> {
  domainId: DomainId;
}

interface InjectedProps extends EditDomainCollectionsProps, FormComponentProps {
  domainCollectionService: DomainCollectionService;
}

export interface EditDomainCollectionState {
  initialCollection: Collection | null;
}

class EditDomainCollectionComponent extends React.Component<InjectedProps, EditDomainCollectionState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private _collectionSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [
      {title: "Collection", link: "/collections"},
      {title: this.props.match.params.id}
    ]);

    this.state = {
      initialCollection: null
    };

    this._collectionSubscription = null;
    this._loadCollection();
  }

  public render(): ReactNode {
    const {initialCollection} = this.state;
    if (initialCollection !== null) {
      return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><Icon type="folder"/> New Collection</span>} className={styles.formCard}>
            <DomainCollectionForm
              initialValue={initialCollection}
              saveButtonLabel="Save"
              disableId={true}
              onCancel={this._handleCancel}
              onSave={this._handleSave}
            />
          </Card>
        </Page>
      );
    } else {
      return null;
    }
  }

  private _handleCancel = () => {
    const url = toDomainUrl("", this.props.domainId, "collections/");
    this.props.history.push(url);
  }

  private _handleSave = (collection: Collection) => {
    const domainId = this.props.domainId;
    this.props.domainCollectionService.updateCollection(domainId, collection)
      .then(() => {
        notification.success({
          message: 'Collection Updated',
          description: `Collection '${collection.id}' successfully updated`
        });
        const url = toDomainUrl("", domainId, "collections/");
        this.props.history.push(url);
      }).catch((err) => {
      if (err instanceof RestError) {
        notification.error({
          message: 'Could Not Update Collection',
          description: `A collection could not be updated.`
        });
      }
    });
  }

  private _loadCollection(): void {
    const {id} = this.props.match.params;
    const {promise, subscription} = makeCancelable(
      this.props.domainCollectionService.getCollection(this.props.domainId, id)
    );

    this._collectionSubscription = subscription;

    promise.then(collection => {
      this.setState({initialCollection: collection});
    })
  }
}

const injections = [SERVICES.DOMAIN_COLLECTION_SERVICE];
export const EditDomainCollection = injectAs<EditDomainCollectionsProps>(injections, Form.create<{}>()(EditDomainCollectionComponent));
