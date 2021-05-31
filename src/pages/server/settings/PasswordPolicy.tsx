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

import React, {FormEvent, ReactNode} from "react";
import {Button, Form, FormInstance, InputNumber, notification, Select} from "antd";
import {FormButtonBar} from "../../../components/common/FormButtonBar";
import styles from "./styles.module.css";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {ConfigService} from "../../../services/ConfigService";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {PasswordConfig} from "../../../models/PasswordConfig";

export interface InjectedProps {
  configService: ConfigService;
}

export interface PasswordPolicyState {
  configs: PasswordConfig | null;
}

const TRUE = "true";
const FALSE = "false";

class PasswordPolicyComponent extends React.Component<InjectedProps, PasswordPolicyState> {
  private _configSubscription: PromiseSubscription | null;
  private _formRef = React.createRef<FormInstance>();

  constructor(props: InjectedProps) {
    super(props);

    this._configSubscription = null;

    this.state = {
      configs: null
    };

    this._loadConfig();
  }

  public render(): ReactNode {
    if (this.state.configs !== null) {
      const minLen = this.state.configs.minLength;
      const lower = this.state.configs.requireLower ? TRUE : FALSE;
      const upper = this.state.configs.requireUpper ? TRUE : FALSE;
      const digits = this.state.configs.requireDigit ? TRUE : FALSE;
      const special = this.state.configs.requireSpecial ? TRUE : FALSE;

      return (
          <Form ref={this._formRef} onFinish={this._handleSubmit} layout="horizontal">
            <Form.Item name="minLength"
                       label="Minimum Length"
                       initialValue={minLen}
            >
              <InputNumber min={4}/>
            </Form.Item>
            <Form.Item name="requireDigit"
                       label="Require Digits"
                       initialValue={digits}
            >
              {this._renderYesNo()}
            </Form.Item>
            <Form.Item name="requireUpperCase"
                       label="Require Upper Case Character"
                       initialValue={upper}
            >
              {this._renderYesNo()}
            </Form.Item>
            <Form.Item name="requireLowerCase"
                       label="Require Lower Case Letters"
                       initialValue={lower}
            >
              {this._renderYesNo()}
            </Form.Item>
            <Form.Item name="requireSpecialCharacter"
                       label="Require Special Characters"
                       initialValue={special}
            >
              {this._renderYesNo()}
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

  private _renderYesNo(): ReactNode {
    return (
        <Select className={styles.yesNo}>
          <Select.Option key="yes" value={TRUE}>Yes</Select.Option>
          <Select.Option key="No" value={FALSE}>No</Select.Option>
        </Select>
    );
  }

  private _handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this._formRef.current!.validateFields().then(values => {
        const {minLength, requireDigit, requireUpperCase, requireLowerCase, requireSpecialCharacter} = values;
        const config = new PasswordConfig(
            minLength,
            requireUpperCase === TRUE,
            requireLowerCase === TRUE,
            requireDigit === TRUE,
            requireSpecialCharacter === TRUE);
        this.props.configService
            .setPasswordConfig(config)
            .then(() =>
                notification.success({
                  message: "Configuration Saved",
                  description: "Password policy configuration successfully saved."
                })
            )
            .catch(err => {
              console.error(err);
              notification.error({
                message: "Configuration Not Saved",
                description: "Password policy configuration could not be saved."
              })
            });
    });
  }

  private _loadConfig(): void {
    const {promise, subscription} = makeCancelable(this.props.configService.getPasswordConfig());
    this._configSubscription = subscription;
    promise.then(configs => {
      this._configSubscription = null;
      this.setState({configs});
    }).catch(err => {
      this._configSubscription = null;
      this.setState({configs: null});
    });
  }
}

export const PasswordPolicy = injectAs<{}>([SERVICES.CONFIG_SERVICE], PasswordPolicyComponent);
