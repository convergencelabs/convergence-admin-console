import * as React from 'react';
import {ReactNode} from "react";
import {Col, Row} from "antd";
import {Form, Input, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import {PromiseSubscription} from "../../utils/make-cancelable";
import {PasswordFormValidator} from "../../utils/PasswordFormValidator";
import {ConfigService} from "../../services/ConfigService";
import {PasswordConfig} from "../../models/PasswordConfig";
import {injectAs} from "../../utils/mobx-utils";
import {FormButtonBar} from "../FormButtonBar";
import {SERVICES} from "../../services/ServiceConstants";

interface SetPasswordProps {
  onSetPassword(password: string): Promise<boolean>;

  onCancel?: () => void;
  showCancel?: boolean;
  okButtonText?: string;
}

interface InjectedProps extends SetPasswordProps, FormComponentProps {
  configService: ConfigService;
}

interface ChangePasswordFormState {
  confirmDirty: boolean;
  passwordConfig: PasswordConfig | null;
}

class SetPasswordFormComponent extends React.Component<InjectedProps, ChangePasswordFormState> {

  private _configSubscription: PromiseSubscription | null;
  private _passwordValidator = new PasswordFormValidator();

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      confirmDirty: false,
      passwordConfig: null
    };

    this._configSubscription = null;

    this.props.configService
      .getPasswordConfig()
      .then(config => {
        this.setState({passwordConfig: config});
      });
  }

  public render(): ReactNode {
    if (this.state.passwordConfig) {
      const {getFieldDecorator} = this.props.form;
      return (
        <Form onSubmit={this._handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: 'Please input a password!',
                  }, {
                    validator: this._compareToConfirm,
                  }],
                })(
                  <Input type="password"/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Confirm Password">
                {getFieldDecorator('confirm', {
                  rules: [{
                    required: true, message: 'Please confirm the password!',
                  }, {
                    validator: this._compareToPassword,
                  }],
                })(
                  <Input type="password" onBlur={this._handleConfirmBlur}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormButtonBar>
                {this.props.showCancel ? <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button> : null}
                <Button type="primary" htmlType="submit">Set Password</Button>
              </FormButtonBar>
            </Col>
          </Row>
        </Form>
      );
    } else {
      return null;
    }
  }

  private _handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  private _handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const {password} = values;
        this.props.onSetPassword(password).then(clear => {
          if (clear) {
            this.props.form.setFieldsValue({
              password: "",
              confirm: ""
            });
          }
        })
      }
    });
  }

  private _handleConfirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }

  private _compareToPassword = (rule: any, value: any, callback: (error?: string) => void) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  private _compareToConfirm = (rule: any, value: any, callback: (error?: string) => void) => {
    if (this._passwordValidator.validatePassword(this.state.passwordConfig!, value, callback)) {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], {force: true});
      }
      callback();
    }
  }
}

const injections = [SERVICES.CONFIG_SERVICE];
export const SetPasswordForm = injectAs<SetPasswordProps>(injections, Form.create<{}>()(SetPasswordFormComponent));
