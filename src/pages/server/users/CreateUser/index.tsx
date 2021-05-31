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
import {UserOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, FormInstance, Input, notification, Row, Select} from "antd";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {CreateUserData, UserService} from "../../../../services/UserService";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {ConfigService} from "../../../../services/ConfigService";
import {PromiseSubscription} from "../../../../utils/make-cancelable";
import {PasswordConfig} from "../../../../models/PasswordConfig";
import {PasswordFormValidator} from "../../../../utils/PasswordFormValidator";

interface InjectedProps extends RouteComponentProps {
  userService: UserService;
  configService: ConfigService;
}

export interface CreateUserComponentState {
  passwordConfig: PasswordConfig | null;
}

class CreateUserComponent extends React.Component<InjectedProps, CreateUserComponentState> {
  private readonly _breadcrumbs = [
    {title: "Convergence Users", link: "/users"},
    {title: "New User"}
  ];

  private _configSubscription: PromiseSubscription | null;
  private _passwordValidator = new PasswordFormValidator();

  private _formRef = React.createRef<FormInstance>();

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
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
    if (this.state.passwordConfig !== null) {
      return (
          <Page breadcrumbs={this._breadcrumbs}>
            <Card title={<span><UserOutlined/> New Convergence User</span>} className={styles.formCard}>
              <Form ref={this._formRef}
                    layout="vertical"
                    onFinish={this._handleSubmit}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="username"
                               label="Username"
                               rules={[
                                 {required: true, whitespace: true, message: 'Please input a Username!'}
                               ]}
                    >
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="displayName"
                               tooltip="The name that should be displayed for this user."
                               label="Display Name"
                               rules={[{required: true, message: 'Please input a Display Name!', whitespace: true}]}
                    >

                      <Input/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="firstName"
                               label="First Name"
                               rules={[
                                 {required: false, whitespace: true, message: 'Please input a First Name!'}
                               ]}
                    >
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="lastName"
                               label="Last Name"
                               rules={[
                                 {required: false, whitespace: true, message: 'Please input a Last Name!'}
                               ]}
                    >
                      <Input/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name="email"
                               label="E-mail"
                               rules={[
                                 {type: 'email', message: 'The input is not valid E-mail!'},
                                 {required: true, message: 'Please input an E-mail!'}
                               ]}
                    >
                      <Input/>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="serverRole"
                           label="Role"
                           initialValue="Developer"
                           rules={[{type: 'string', required: true, message: 'Please select a role!'}]}
                >
                  <Select>
                    <Select.Option value="Developer">Developer</Select.Option>
                    <Select.Option value="Domain Admin">Domain Admin</Select.Option>
                    <Select.Option value="Server Admin">Server Admin</Select.Option>
                  </Select>
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="password"
                               label="Password"
                               rules={[
                                 {required: true, message: 'Please input a password!'},
                                 {validator: this._validatePassword}
                               ]}
                               hasFeedback
                    >

                      <Input type="password"/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="confirm"
                               label="Confirm Password"
                               dependencies={["password"]}
                               rules={[
                                 {required: true, message: 'Please confirm the password!'},
                                 {validator: this._validateConfirmationPassword}
                               ]}
                    >
                      <Input type="password"/>
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
    } else {
      return null;
    }
  }

  private _handleCancel = () => {
    this.props.history.push("/users/");
  }

  private _handleSubmit = (values: any) => {
    const {username, displayName, firstName, lastName, email, password, serverRole} = values;
    const userData: CreateUserData = {
      username,
      displayName,
      firstName,
      lastName,
      email,
      password,
      serverRole
    };
    this.props.userService.createUser(userData).then(() => {
      notification.success({
        message: 'User Created',
        description: `Convergence User '${username}' successfully created.`
      });
      this.props.history.push("/users");
    }).catch((err) => {
      let description = `The user could not be created. Check the console for additional details.`
      if (err instanceof RestError && err.code === "duplicate") {
          description = `A user with the specified ${err.details["field"]} already exists.`
      } else {
        console.error(err);
      }

      notification.error({
        message: 'Could Not Create User',
        description
      });
    });
  }

  public componentWillUnmount(): void {
    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
      this._configSubscription = null;
    }
  }

  private _validateConfirmationPassword = (rule: any, value: any): Promise<void> => {
    if (value && value !== this._formRef.current!.getFieldValue('password')) {
      return Promise.reject(new Error('The passwords do not match!'));
    } else {
      return Promise.resolve();

    }
  }

  private _validatePassword = (rule: any, value: any, callback: (error?: string) => void) => {
    if (this._passwordValidator.validatePassword(this.state.passwordConfig!, value, callback)) {
      callback();
    }
  }
}

const injections = [SERVICES.USER_SERVICE, SERVICES.CONFIG_SERVICE];
export const CreateUser = injectAs<RouteComponentProps>(injections, CreateUserComponent);
