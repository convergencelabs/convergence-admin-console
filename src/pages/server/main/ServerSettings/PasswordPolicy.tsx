import React, {ReactNode} from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Select, Form, InputNumber, notification} from "antd";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {ConfigService} from "../../../../services/ConfigService";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {PasswordConfig} from "../../../../models/PasswordConfig";

export interface InjectedProps extends FormComponentProps {
  configService: ConfigService;
}

export interface PasswordPolicyState {
  configs: PasswordConfig | null;
}

const TRUE = "true";
const FALSE = "false";

class PasswordPolicyComponent extends React.Component<InjectedProps, PasswordPolicyState> {
  private _configSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._configSubscription = null;

    this.state = {
      configs: null
    };

    this._loadConfig();
  }

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    if (this.state.configs !== null) {
      const minLen = this.state.configs.minLength;
      const lower = this.state.configs.requireLower ? TRUE : FALSE;
      const upper = this.state.configs.requireUpper ? TRUE : FALSE;
      const digits = this.state.configs.requireDigit ? TRUE : FALSE;
      const special = this.state.configs.requireSpecial ? TRUE : FALSE;

      return (
        <Form onSubmit={this._handleSubmit} layout="horizontal">
          <Form.Item label="Minimum Length">
            {getFieldDecorator('minLength', {initialValue: minLen})(
              <InputNumber min={4}/>
            )}
          </Form.Item>
          <Form.Item label="Require Digits">
            {getFieldDecorator('requireDigit', {initialValue: digits})(this._renderYesNo())}
          </Form.Item>
          <Form.Item label="Require Upper Case Character">
            {getFieldDecorator('requireUpperCase', {initialValue: upper})(this._renderYesNo())}
          </Form.Item>
          <Form.Item label="Require Lower Case Letters">
            {getFieldDecorator('requireLowerCase', {initialValue: lower})(this._renderYesNo())}
          </Form.Item>
          <Form.Item label="Require Special Characters">
            {getFieldDecorator('requireSpecialCharacter', {initialValue: special})(this._renderYesNo())}
          </Form.Item>
          <FormButtonBar>
            <Button type="primary" htmlType="submit">Save</Button>
          </FormButtonBar>
        </Form>
      );
    } else {
      return (null);
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

  private _handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
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
      }
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

export const PasswordPolicy = injectAs<{}>([SERVICES.CONFIG_SERVICE], Form.create<{}>()(PasswordPolicyComponent));
