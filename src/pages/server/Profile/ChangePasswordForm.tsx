import * as React from 'react';
import {ReactNode} from "react";
import {Card, Col, notification, Row} from "antd";
import {Form, Input, Tooltip, Icon, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {FormButtonBar} from "../../../components/FormButtonBar/";
import {UserService} from "../../../services/UserService";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";

interface InjectedProps extends FormComponentProps {
  userService: UserService;
}

interface ChangePasswordFormState {
  confirmDirty: boolean;
}

class ChangePasswordFormComponent extends React.Component<InjectedProps, ChangePasswordFormState> {
  state = {
    confirmDirty: false
  };

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Card title={<span><Icon type="lock"/> Change Password</span>} className={styles.setPassword}>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: 'Please input a password!',
                  }, {
                    validator: this.validateToNextPassword,
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
                    validator: this.compareToFirstPassword,
                  }],
                })(
                  <Input type="password" onBlur={this.handleConfirmBlur}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormButtonBar>
                <Button type="primary" htmlType="submit">Set Password</Button>
              </FormButtonBar>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  private handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
        const {password} = values;

      }
    });
  }

  private handleConfirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }

  private compareToFirstPassword = (rule: any, value: any, callback: (error?: string) => void) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  private validateToNextPassword = (rule: any, value: any, callback: (error?: string) => void) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  }
}

export const ChangePasswordForm = injectAs<{}>([SERVICES.USER_SERVICE], Form.create<{}>()(ChangePasswordFormComponent));
