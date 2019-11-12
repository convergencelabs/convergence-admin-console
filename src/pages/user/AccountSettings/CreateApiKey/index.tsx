/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import * as React from 'react';
import {ReactNode} from 'react';
import {Page} from "../../../../components/common/Page";
import {Card, Form, Icon, notification} from "antd";
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {ApiKeyService} from "../../../../services/ApiKeyService";
import {ApiKeyForm} from "../../../../components/user/ApiKeyForm";
import {UserApiKey} from "../../../../models/UserApiKey";

interface InjectedProps extends RouteComponentProps, FormComponentProps {
  apiKeyService: ApiKeyService;
}

class CreateApiKeyComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Account Settings", link: "/account-settings"},
    {title: "Create API Key"}
  ];

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="key"/> New API Key</span>} className={styles.formCard}>
          <ApiKeyForm initialValue={new UserApiKey("", "", true)} saveButtonLabel="Create"
                      onCancel={this._handleCancel} onSave={this._handleSubmit}
          />
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    this.props.history.push("/account-settings/");
  }

  private _handleSubmit = (data: { name: string, enabled: boolean }) => {
    this.props.apiKeyService.createUserApiKey(data.name, data.enabled)
      .then(() => {
        notification.success({
          message: 'API Key Created',
          description: `API Key '${data.name}' successfully created`,
          placement: "bottomRight",
          duration: 3
        });
        this.props.history.push("/account-settings");
      }).catch((err) => {
      if (err instanceof RestError) {
        console.log(JSON.stringify(err));
        if (err.code === "duplicate") {
          notification["error"]({
            message: 'Could Not Create API Key',
            description: `An API Key with the specified ${err.details["field"]} already exists.`,
            placement: "bottomRight"
          });
        }
      }
    });
  }
}

export const CreateApiKey = injectAs<RouteComponentProps>([SERVICES.API_KEY_SERVICE], Form.create()(CreateApiKeyComponent));
