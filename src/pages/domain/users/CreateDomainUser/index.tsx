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

import React, {ReactNode} from 'react';
import {Page} from "../../../../components";
import {QuestionCircleOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, FormInstance, Input, notification, Row, Tooltip} from "antd";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {DomainUserService} from "../../../../services/domain/DomainUserService";
import {DomainId} from "../../../../models/DomainId";
import {CreateDomainUserData} from "../../../../services/domain/common-rest-data";
import {toDomainRoute} from "../../../../utils/domain-url";
import styles from "./styles.module.css";

export interface CreateDomainUserProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends CreateDomainUserProps {
  domainUserService: DomainUserService;
}

class CreateDomainUserComponent extends React.Component<InjectedProps> {
  private readonly _breadcrumbs = [
    {title: "Users", link: toDomainRoute(this.props.domainId, "users/")},
    {title: "New User"}
  ];

  private _formRef = React.createRef<FormInstance>();

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      confirmDirty: false
    };
  }

  public render(): ReactNode {
    return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><UserOutlined/> New User</span>} className={styles.formCard}>
            <Form ref={this._formRef} onFinish={this._handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="username"
                             label="Username"
                             rules={[{
                               required: true, whitespace: true, message: 'Please input a Username!'
                             }]}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                      name="displayName"
                      label={(
                          <span>Display Name&nbsp;
                            <Tooltip title="What do you want others to call you?">
                          <QuestionCircleOutlined/>
                        </Tooltip>
                      </span>
                      )}
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
                             rules={[{required: false, whitespace: true, message: 'Please input a First Name!'}]}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastName"
                             label="Last Name"
                             rules={[{required: false, whitespace: true, message: 'Please input a Last Name!'}]}
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
                               {required: false, message: 'Please input an E-mail!'}
                             ]}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="password"
                             label="Password"
                             rules={[{required: true, message: 'Please input a password!'}]}
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
                               {validator: this._validateConfirm}
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
  }

  private _handleCancel = () => {
    const url = toDomainRoute(this.props.domainId, "users/");
    this.props.history.push(url);
  }

  private _handleSubmit = () => {
    this._formRef.current!.validateFields().then(values => {
        const {username, displayName, firstName, lastName, email, password} = values;
        const userData: CreateDomainUserData = {
          username,
          displayName,
          firstName,
          lastName,
          email,
          password
        };
        this.props.domainUserService.createUser(this.props.domainId, userData)
            .then(() => {
              notification.success({
                message: 'User Created',
                description: `User '${username}' successfully created.`
              });
              const url = toDomainRoute(this.props.domainId, "users/");
              this.props.history.push(url);
            }).catch((err) => {
          if (err instanceof RestError) {
            if (err.code === "duplicate") {
              notification.error({
                message: 'Could Not Create User',
                description: `A user with the specified ${err.details["field"]} already exists.`
              });
            }
          }
        });
    });
  }

  private _validateConfirm = (rule: any, value: any, callback: (error?: string) => void) => {
    if (value && value !== this._formRef.current!.getFieldValue('password')) {
      callback('The passwords do not match!');
    } else {
      callback();
    }
  }
}

const injections = [SERVICES.DOMAIN_USER_SERVICE];
export const CreateDomainUser = injectAs<CreateDomainUserProps>(injections, CreateDomainUserComponent);
