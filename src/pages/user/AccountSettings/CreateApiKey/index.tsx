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

import * as React from 'react';
import {ReactNode} from 'react';
import {Page} from "../../../../components";
import { KeyOutlined } from '@ant-design/icons';
import { Card, notification } from "antd";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {ApiKeyService} from "../../../../services/ApiKeyService";
import {ApiKeyForm} from "../../../../components/user/ApiKeyForm";
import {UserApiKey} from "../../../../models/UserApiKey";

interface InjectedProps extends RouteComponentProps {
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
        <Card title={<span><KeyOutlined /> New API Key</span>} className={styles.formCard}>
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

export const CreateApiKey = injectAs<RouteComponentProps>([SERVICES.API_KEY_SERVICE],CreateApiKeyComponent);
