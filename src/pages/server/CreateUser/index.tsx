import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import {Card, Col, Row} from "antd";
import {Form, Input, Tooltip, Icon, Button, Select} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../components/FormButtonBar";

const {Option} = Select;

interface CreateUserComponentState {
  confirmDirty: boolean;
}

export class CreateUserComponent extends React.Component<RouteComponentProps & FormComponentProps, CreateUserComponentState> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([
    {title: "Users", link: "/users"},
    {title: "New User"}
  ]);

  state = {
    confirmDirty: false
  };

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <Card title={<span><Icon type="user"/> New User</span>} className={styles.formCard}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Username">
                  {getFieldDecorator('username', {
                    rules: [{
                      required: true, whitespace: true, message: 'Please input a Username!',
                    }],
                  })(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={(
                  <span>Display Name&nbsp;
                    <Tooltip title="What do you want others to call you?">
                  <Icon type="question-circle-o"/>
                </Tooltip>
                </span>
                )}>
                  {getFieldDecorator('displayName', {
                    rules: [{required: true, message: 'Please input a Display Name!', whitespace: true}],
                  })(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="First Name">
                  {getFieldDecorator('firstName', {
                    rules: [{
                      required: false, whitespace: true, message: 'Please input a First Name!',
                    }],
                  })(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name">
                  {getFieldDecorator('lastName', {
                    rules: [{
                      required: false, whitespace: true, message: 'Please input a Last Name!',
                    }],
                  })(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="E-mail">
                  {getFieldDecorator('email', {
                    rules: [{
                      type: 'email', message: 'The input is not valid E-mail!',
                    }, {
                      required: true, message: 'Please input an E-mail!',
                    }],
                  })(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Role">
              {getFieldDecorator('role', {
                initialValue: "developer",
                rules: [{type: 'string', required: true, message: 'Please select a role!'}],
              })(
                <Select>
                  <Option value="admin">Admin</Option>
                  <Option value="developer">Developer</Option>
                </Select>
              )}
            </Form.Item>
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
                  <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit">Create</Button>
                </FormButtonBar>
              </Col>
            </Row>
          </Form>
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    this.props.history.push("/users/");
  }

  private handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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

export const CreateUser = Form.create<{}>()(CreateUserComponent);
