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
import {Button, Card, Col, Form, FormInstance, Input, notification, Row, Select, Tooltip} from "antd";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {RestError} from "../../../../services/RestError";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainId} from "../../../../models/DomainId";
import {DomainUserService} from "../../../../services/domain/DomainUserService";
import {DomainUser} from "../../../../models/domain/DomainUser";
import {toDomainRoute} from "../../../../utils/domain-url";
import {UpdateDomainUserData} from "../../../../services/domain/common-rest-data";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar";
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";
import styles from "./styles.module.css";
import {SERVICES} from "../../../../services/ServiceConstants";
import {injectAs} from "../../../../utils/mobx-utils";


export interface EditDomainUserProps extends RouteComponentProps<{ username: string }> {
  domainId: DomainId;
}

interface InjectedProps extends EditDomainUserProps {
  domainUserService: DomainUserService;
}

export interface EditDomainUserState {
  user: DomainUser | null
}

class EditDomainUserComponent extends React.Component<InjectedProps, EditDomainUserState> {
  private readonly _breadcrumbs: IBreadcrumbSegment[];
  private _userSubscription: PromiseSubscription | null;
  private _formRef = React.createRef<FormInstance>();

  constructor(props: InjectedProps) {
    super(props);

    this._breadcrumbs = [
      {title: "Users", link: toDomainRoute(this.props.domainId, "users/")},
      {title: this.props.match.params.username}
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
            <Card title={this._renderToolbar()} className={styles.formCard}>
              <Form ref={this._formRef} onFinish={this._handleSubmit}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="username"
                               label="Username"
                               initialValue={user.username}
                               rules={[{
                                 required: true, whitespace: true, message: 'Please input a Username!'
                               }]}
                    >
                      <Input disabled={true}/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="displayName"
                               label={(
                                   <span>Display Name&nbsp;
                                     <Tooltip title="The name that should be displayed for this user.">
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
                                 {required: false, message: 'Please input an E-mail!'}
                               ]}
                    >
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name="status"
                               label="User Status"
                               initialValue={user.disabled ? "disabled" : "enabled"}
                    >
                      <Select>
                        <Select.Option key="enabled" value="enabled">Enabled</Select.Option>
                        <Select.Option key="disabled" value="disabled">Disabled</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
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
      return null;
    }
  }

  private _renderToolbar(): ReactNode {
      return (<CardTitleToolbar icon={<UserOutlined />} title="Edit User"/>)
    }

  private _loadUser(): void {
      const {promise, subscription} = makeCancelable(
          this.props.domainUserService.getUser(this.props.domainId, this.props.match.params.username));
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
      const usersUrl = toDomainRoute(this.props.domainId, "users/");
      this.props.history.push(usersUrl);
    }

  private _handleSubmit = () => {
      this._formRef.current!.validateFields().then(values => {
          const {username, displayName, firstName, lastName, email, status} = values;
          const disabled = status === "disabled";
          const userData: UpdateDomainUserData = {
            displayName,
            firstName,
            lastName,
            email,
            disabled
          };
          this.props.domainUserService.updateUser(this.props.domainId, username, userData)
              .then(() => {
                notification.success({
                  message: 'User Updated',
                  description: `User '${username}' successfully updated`
                });
                const usersUrl = toDomainRoute(this.props.domainId, "users/");
                this.props.history.push(usersUrl);
              }).catch((err) => {
            if (err instanceof RestError) {
              console.log(JSON.stringify(err));
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
  }

const injections = [SERVICES.DOMAIN_USER_SERVICE];
export const EditDomainUser = injectAs<EditDomainUserProps>(injections, EditDomainUserComponent);
