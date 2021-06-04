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
import {Page} from "../../../../components";
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";
import { UserOutlined } from '@ant-design/icons';
import { Card, notification, Tag } from "antd";
import {RouteComponentProps} from "react-router";
import {UserService} from "../../../../services/UserService";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {ConvergenceUserPasswordForm} from "../../../../components/common/ConvergenceUserPasswordForm/"
import {RestError} from "../../../../services/RestError";
import styles from "./styles.module.css";

interface InjectedProps extends RouteComponentProps<{ username: string }> {
  userService: UserService;
}

export interface SetUserPasswordState {

}

class SetUserPasswordComponent extends React.Component<InjectedProps, SetUserPasswordState> {
  private readonly _breadcrumbs: IBreadcrumbSegment[];


  constructor(props: InjectedProps) {
    super(props);

    const username = this.props.match.params.username;
    this._breadcrumbs = [
      {title: "Users", link: "/users"},
      {title: username},
      {title: "Set Password"}
    ];
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><UserOutlined /> <Tag>{this.props.match.params.username}</Tag> Set Password</span>}
              className={styles.formCard}>
          <ConvergenceUserPasswordForm
            onSetPassword={this._handleSetPassword}
            onCancel={this._handleCancel}
            showCancel={true}
          />
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    this.props.history.push("/users/");
  }

  private _handleSetPassword = (password: string) => {
    const username = this.props.match.params.username;
    return this.props.userService.setPassword(username, password)
      .then(() => {
        notification.success({
          message: 'Password Changed',
          description: `Password for '${username}' successfully set.`
        });
        this.props.history.push("/users/");
        return false;
      }).catch((err) => {
        console.error(err);
        if (err instanceof RestError) {
          notification.error({
            message: 'Could Not Set Password',
            description: `The password for ${username} could not be set.`
          });
        }
        return false;
      });
  }
}

const injections = [SERVICES.USER_SERVICE];
export const SetUserPassword = injectAs<RouteComponentProps>(injections, SetUserPasswordComponent);
