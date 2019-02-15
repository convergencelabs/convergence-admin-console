import * as React from 'react';
import {ReactNode} from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Select, Form, InputNumber} from "antd";
import {FormButtonBar} from "../../../components/FormButtonBar";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {ConfigService} from "../../../services/ConfigService";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {CONFIG} from "../../../constants/config";

const {Option} = Select;

interface InjectedProps extends FormComponentProps {
  configService: ConfigService;
}

interface PasswordPolicyState {
  configs: Map<string, any> | null;
}

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
      const minLen = this.state.configs.get(CONFIG.Passwords.MinimumLength);
      const lower = this.state.configs.get(CONFIG.Passwords.RequireLowerCase) ? "true" : "false";
      const upper = this.state.configs.get(CONFIG.Passwords.RequireUpperCase) ? "true" : "false";
      const digits = this.state.configs.get(CONFIG.Passwords.RequireNumeric) ? "true" : "false";
      const special = this.state.configs.get(CONFIG.Passwords.RequireSpecialCharacters) ? "true" : "false";
      return (
        <Form onSubmit={this._handleSubmit} layout="horizontal">
          <Form.Item label="Minimum Length">
            {getFieldDecorator('min-length', {initialValue: minLen})(
              <InputNumber min={4}/>
            )}
          </Form.Item>
          <Form.Item label="Require Digits">
            {getFieldDecorator('require-digit', {initialValue: digits})(this._renderYesNo())}
          </Form.Item>
          <Form.Item label="Require Upper Case Character">
            {getFieldDecorator('require-upper-case', {initialValue: upper})(this._renderYesNo())}
          </Form.Item>
          <Form.Item label="Require Lower Case Letters">
            {getFieldDecorator('require-lower-case', {initialValue: lower})(this._renderYesNo())}
          </Form.Item>
          <Form.Item label="Require Special Characters">
            {getFieldDecorator('require-special-character', {initialValue: special})(this._renderYesNo())}
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
        <Option key="yes" value="true">Yes</Option>
        <Option key="No" value="false">No</Option>
      </Select>
    );
  }

  private _handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  private _loadConfig(): void {
    const {promise, subscription} = makeCancelable(this.props.configService.getConfig());
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
