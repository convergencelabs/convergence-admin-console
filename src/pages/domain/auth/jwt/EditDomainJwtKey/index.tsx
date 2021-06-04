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
import { KeyOutlined } from '@ant-design/icons';
import { Card, notification } from "antd";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {DomainId} from "../../../../../models/DomainId";
import {DomainJwtKeyService} from "../../../../../services/domain/DomainJwtKeyService";
import {DomainJwtKey} from "../../../../../models/domain/DomainJwtKey";
import {makeCancelable, PromiseSubscription} from "../../../../../utils/make-cancelable";
import {toDomainRoute} from "../../../../../utils/domain-url";
import {SERVICES} from "../../../../../services/ServiceConstants";
import {injectAs} from "../../../../../utils/mobx-utils";
import {RestError} from "../../../../../services/RestError";
import {Page} from "../../../../../components";
import {DomainJwtKeyForm} from "../../../../../components/domain/auth/DomainJwtKeyForm";
import {IBreadcrumbSegment} from "../../../../../stores/BreacrumsStore";

export interface EditDomainJwtKeyProps extends RouteComponentProps<{id: string}> {
  domainId: DomainId;
}

interface InjectedProps extends EditDomainJwtKeyProps {
  domainJwtKeyService: DomainJwtKeyService;
}

export interface EditDomainJwtKeyState {
  initialKey: DomainJwtKey | null;
}

class EditDomainJwtKeyComponent extends React.Component<InjectedProps, EditDomainJwtKeyState> {
  private readonly _breadcrumbs: IBreadcrumbSegment[];
  private _keySubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._breadcrumbs = [
      {title: "Authentication", link: toDomainRoute(this.props.domainId, "authentication/")},
      {title: "JWT Keys", link: toDomainRoute(this.props.domainId, "authentication/jwt")},
      {title: this.props.match.params.id}
    ];

    this.state = {
      initialKey: null
    };

    this._keySubscription = null;
    this._loadKey();
  }

  public render(): ReactNode {
    if (this.state.initialKey !== null) {
      return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><KeyOutlined /> Edit JWT Key</span>} className={styles.formCard}>
            <DomainJwtKeyForm
              disableId={true}
              domainId={this.props.domainId}
              saveButtonLabel="Save"
              initialValue={this.state.initialKey}
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
    const url = toDomainRoute(this.props.domainId, "authentication/jwt");
    this.props.history.push(url);
  }

  private _handleSave = (key: DomainJwtKey) => {
    this.props.domainJwtKeyService.updateKey(this.props.domainId, key)
      .then(() => {
        notification.success({
          message: 'Key Updated',
          description: `Key '${key.id}' successfully updated.`
        });
        const url = toDomainRoute(this.props.domainId, "authentication/jwt");
        this.props.history.push(url);
      }).catch((err) => {
      if (err instanceof RestError) {
        if (err.code === "duplicate") {
          notification.error({
            message: 'Could Not Update Key',
            description: `A key with the specified ${err.details["field"]} already exists.`
          });
        }
      }
    });
  }

  private _loadKey(): void {
    const {id} = this.props.match.params;
    const {promise, subscription} = makeCancelable(
      this.props.domainJwtKeyService.getKey(this.props.domainId, id)
    );

    this._keySubscription = subscription;

    promise.then(key => {
      this.setState({initialKey: key});
    })
  }
}

const injections = [SERVICES.DOMAIN_JWT_KEY_SERVICE];
export const EditDomainJwtKey = injectAs<EditDomainJwtKeyProps>(injections, EditDomainJwtKeyComponent);
