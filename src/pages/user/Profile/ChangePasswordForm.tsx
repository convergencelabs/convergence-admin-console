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
import { LockOutlined } from '@ant-design/icons';
import { Card, notification } from "antd";
import styles from "./styles.module.css";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {LoggedInUserService} from "../../../services/LoggedInUserService";
import {ConvergenceUserPasswordForm} from "../../../components/common/ConvergenceUserPasswordForm";

interface InjectedProps {
  loggedInUserService: LoggedInUserService;
}

class ChangePasswordFormComponent extends React.Component<InjectedProps, {}> {

  public render(): ReactNode {
    return (
      <Card title={<span><LockOutlined /> Change Password</span>} className={styles.setPassword}>
        <ConvergenceUserPasswordForm
          onSetPassword={this._handleSetPassword}
          showCancel={false}
        />
      </Card>
    );
  }

  private _handleSetPassword = (password: string) => {
    return this.props.loggedInUserService
      .setPassword(password)
      .then(() => {
          notification.success({
            message: "Success",
            description: "Your password was successfully updated."
          });
          return true;
        }
      )
      .catch(() => {
          notification.success({
            message: "Error",
            description: "Your password could not be set."
          });
          return false;
        }
      );
  }
}

const injections = [SERVICES.LOGGED_IN_USER_SERVICE];
export const ChangePasswordForm = injectAs<{}>(injections, ChangePasswordFormComponent);
