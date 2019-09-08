import * as React from 'react';
import {ReactNode} from "react";
import {Col, Row} from "antd";
import {Form, Input, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import {PromiseSubscription} from "../../../utils/make-cancelable";
import {PasswordFormValidator} from "../../../utils/PasswordFormValidator";
import {PasswordConfig} from "../../../models/PasswordConfig";
import {FormButtonBar} from "../FormButtonBar/";

interface SetPasswordProps {
  onSetPassword(password: string): Promise<boolean>;
  onCancel?: () => void;
  showCancel?: boolean;
  okButtonText?: string;
  passwordConfig: PasswordConfig;
}

interface InjectedProps extends SetPasswordProps, FormComponentProps {

}

interface ChangePasswordFormState {
  confirmDirty: boolean;
}

class SetPasswordFormComponent extends React.Component<InjectedProps, ChangePasswordFormState> {

  private _configSubscription: PromiseSubscription | null;
  private _passwordValidator = new PasswordFormValidator();

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      confirmDirty: false
    };

    this._configSubscription = null;
  }

  public render(): ReactNode {
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
    if (this._passwordValidator.validatePassword(this.props.passwordConfig, value, callback)) {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], {force: true});
      }
      callback();
    }
  }
}

export const SetPasswordForm = Form.create({})(SetPasswordFormComponent);
