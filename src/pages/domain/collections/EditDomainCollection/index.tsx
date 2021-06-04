/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ReactNode} from "react";
import { FolderOutlined } from '@ant-design/icons';
import { Card, notification } from "antd";
import {RouteComponentProps} from "react-router";
import {Page} from "../../../../components";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {DomainCollectionService} from "../../../../services/domain/DomainCollectionService";
import {Collection} from "../../../../models/domain/Collection";
import {toDomainRoute} from "../../../../utils/domain-url";
import {DomainId} from "../../../../models/DomainId";
import {DomainCollectionForm} from "../../../../components/domain/collection/DomainCollectionForm";
import styles from "./styles.module.css";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";

export interface EditDomainCollectionsProps extends RouteComponentProps<{ id: string }> {
  domainId: DomainId;
}

interface InjectedProps extends EditDomainCollectionsProps {
  domainCollectionService: DomainCollectionService;
}

export interface EditDomainCollectionState {
  initialCollection: Collection | null;
}

class EditDomainCollectionComponent extends React.Component<InjectedProps, EditDomainCollectionState> {
  private readonly _breadcrumbs = [
    {title: "Collection", link: toDomainRoute(this.props.domainId, "collections")},
    {title: this.props.match.params.id}
  ];

  private _collectionSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      initialCollection: null
    };

    this._collectionSubscription = null;
    this._loadCollection();
  }

  public componentWillUnmount(): void {
    if (this._collectionSubscription !== null) {
      this._collectionSubscription.unsubscribe();
      this._collectionSubscription = null;
    }
  }

  public render(): ReactNode {
    const {initialCollection} = this.state;
    if (initialCollection !== null) {
      return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><FolderOutlined /> Edit Collection</span>} className={styles.formCard}>
            <DomainCollectionForm
              domainId={this.props.domainId}
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
    const url = toDomainRoute(this.props.domainId, "collections/");
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
        const url = toDomainRoute(domainId, "collections/");
        this.props.history.push(url);
      }).catch((err) => {
      if (err instanceof RestError) {
        notification.error({
          message: 'Could Not Update Collection',
          description: `The collection could not be updated.`
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
export const EditDomainCollection = injectAs<EditDomainCollectionsProps>(injections, EditDomainCollectionComponent);
