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
import {Button, Form, InputNumber, notification} from "antd";
import {FormButtonBar} from "../../../components/common/FormButtonBar";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {ConfigService} from "../../../services/ConfigService";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";

export interface InjectedProps {
  configService: ConfigService;
}

export interface SessionTimeoutState {
  timeout: number | null;
}

class SessionTimeoutComponent extends React.Component<InjectedProps, SessionTimeoutState> {
  private _configSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._configSubscription = null;

    this.state = {
      timeout: null
    };

    this._loadConfig();
  }

  public render(): ReactNode {
    if (this.state.timeout !== null) {
      return (
          <Form layout="vertical"
                onFinish={this._handleSubmit}>
            <Form.Item name="v"
                       label="Session Timeout (minutes)"
                       initialValue={this.state.timeout}
            >
              <InputNumber min={1}/>
            </Form.Item>
            <FormButtonBar>
              <Button type="primary" htmlType="submit">Save</Button>
            </FormButtonBar>
          </Form>
      );
    } else {
      return null;
    }
  }

  public componentWillUnmount(): void {
    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
    }
  }

  private _handleSubmit = (values: any) => {
    const {timeout} = values;
    this.props.configService
        .setSessionTimeoutMinutes(timeout)
        .then(() =>
            notification.success({
              message: "Configuration Saved",
              description: "The session timeout was successfully saved."
            })
        )
        .catch(err => {
          console.error(err);
          notification.error({
            message: "Configuration Not Saved",
            description: "The session timeout configuration could not be saved."
          })
        });
  }

  private _loadConfig(): void {
    const {promise, subscription} = makeCancelable(this.props.configService.getSessionTimeoutMinutes());
    this._configSubscription = subscription;
    promise.then(timeout => {
      this._configSubscription = null;
      this.setState({timeout});
    }).catch(_ => {
      this._configSubscription = null;
      this.setState({timeout: null});
    });
  }
}

export const SessionTimeout = injectAs([SERVICES.CONFIG_SERVICE], SessionTimeoutComponent);
