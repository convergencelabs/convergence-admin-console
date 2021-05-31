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
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";
import {QuestionCircleOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, FormInstance, Input, notification, Row, Select, Tooltip} from "antd";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {UpdateUserData, UserService} from "../../../../services/UserService";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {ConvergenceUser} from "../../../../models/ConvergenceUser";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import styles from "./styles.module.css";
import {loggedInUserStore} from "../../../../stores/LoggedInUserStore";

interface InjectedProps extends RouteComponentProps<{ username: string }> {
  userService: UserService;
}

export interface EditUserState {
  user: ConvergenceUser | null
}

class EditUserComponent extends React.Component<InjectedProps, EditUserState> {
  private readonly _breadcrumbs: IBreadcrumbSegment[];
  private _userSubscription: PromiseSubscription | null;
  private _formRef = React.createRef<FormInstance>();

  constructor(props: InjectedProps) {
    super(props);

    const username = this.props.match.params.username;
    this._breadcrumbs = [
      {title: "Convergence Users", link: "/users/"},
      {title: username}
    ];

    this.state = {
      user: null
    };

    this._userSubscription = null;

    this._loadUser();
  }

  public componentWillUnmount(): void {
    if (this._userSubscription) {
      this._userSubscription.unsubscribe();
      this._userSubscription = null;
    }
  }

  public render(): ReactNode {
    if (this.state.user !== null) {
      const user = this.state.user;
      return (
          <Page breadcrumbs={this._breadcrumbs}>
            <Card title={<span><UserOutlined/> Edit Convergence User</span>} className={styles.formCard}>
              <Form ref={this._formRef}
                    layout="vertical"
                    onFinish={this.handleSubmit}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="username"
                               label="Username"
                               initialValue={user.username}
                               rules={[{
                                 required: true, whitespace: true, message: 'Please input a Username!',
                               }]}
                    >
                      <Input disabled={true}/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="displayName"
                               label={(
                                   <span>Display Name&nbsp;
                                     <Tooltip title="What do you want others to call you?">
                              <QuestionCircleOutlined/>
                            </Tooltip>
                          </span>
                               )}
                               initialValue={user.displayName}
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
                               initialValue={user.firstName}
                               rules={[{required: false, whitespace: true, message: 'Please input a First Name!'}]}
                    >
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="lastName"
                               label="Last Name"
                               initialValue={user.lastName}
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
                               initialValue={user.email}
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
                           initialValue={user.serverRole}
                           rules={[{type: 'string', required: true, message: 'Please select a role!'}]}
                >
                  <Select disabled={user.username === loggedInUserStore.loggedInUser?.username!}>
                    <Select.Option value="Developer">Developer</Select.Option>
                    <Select.Option value="Domain Admin">Domain Admin</Select.Option>
                    <Select.Option value="Server Admin">Server Admin</Select.Option>
                  </Select>
                </Form.Item>
                <Row>
                  <Col span={24}>
                    <FormButtonBar>
                      <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button>
                      <Button type="primary" htmlType="submit">Save</Button>
                    </FormButtonBar>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Page>
      );
    } else {
      return <div></div>;
    }
  }

  private _loadUser(): void {
    const {promise, subscription} = makeCancelable(this.props.userService.getUser(this.props.match.params.username));
    this._userSubscription = subscription;
    promise.then(user => {
      this._userSubscription = null;
      this.setState({user});
    }).catch(err => {
      this._userSubscription = null;
      this.setState({user: null});
    });
  }

  private _handleCancel = () => {
    this.props.history.push("/users/");
  }

  private handleSubmit = () => {
    this._formRef.current!.validateFields().then(values => {
        const {username, displayName, firstName, lastName, email, serverRole} = values;
        const userData: UpdateUserData = {
          displayName,
          firstName,
          lastName,
          email,
          serverRole
        };
        this.props.userService.updateUser(username, userData)
            .then(() => {
              notification.success({
                message: 'User Updated',
                description: `User '${username}' successfully updated.`
              });
              this.props.history.push("./");
            }).catch((err) => {
          if (err instanceof RestError) {
            console.log(JSON.stringify(err));
            if (err.code === "duplicate") {
              notification.error({
                message: 'Could Not Update User',
                description: `A user with the specified ${err.details["field"]} already exists.`
              });
            }
          }
        });
    });
  }
}

const injections = [SERVICES.USER_SERVICE];
export const EditUser = injectAs<RouteComponentProps>(injections, EditUserComponent);
