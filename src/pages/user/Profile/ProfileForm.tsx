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

import * as React from 'react';
import {FormEvent, ReactNode} from 'react';
import {QuestionCircleOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, FormInstance, Input, notification, Row, Tooltip} from "antd";
import styles from "./styles.module.css";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {LoggedInUserService} from "../../../services/LoggedInUserService";
import {UserProfile} from "../../../models/UserProfile";
import {FormButtonBar} from "../../../components/common/FormButtonBar";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";

export interface ProfileFormProps {
  username: string;
}

interface InjectedProps extends ProfileFormProps {
  loggedInUserService: LoggedInUserService;
}

export interface EditUserState {
  profile: UserProfile | null
}

class ProfileFormComponent extends React.Component<InjectedProps, EditUserState> {
  private _profileSubscription: PromiseSubscription | null;
  private _formRef = React.createRef<FormInstance>();

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      profile: null
    };

    this._profileSubscription = null;

    this._loadProfile();
  }

  public componentWillUnmount(): void {
    if (this._profileSubscription) {
      this._profileSubscription.unsubscribe();
      this._profileSubscription = null;
    }
  }

  public render(): ReactNode {
    if (this.state.profile !== null) {
      const profile = this.state.profile;
      return (
          <Card title={<span><UserOutlined/> Edit User</span>} className={styles.formCard}>
            <Form ref={this._formRef} onFinish={this.handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="username"
                             label="Username"
                             initialValue={profile.username}
                             rules={[{required: true, whitespace: true, message: 'Please input a Username!'}]}
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
                             initialValue={profile.displayName}
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
                             initialValue={profile.firstName}
                             rules={[{required: false, whitespace: true, message: 'Please input a First Name!'}]}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastName"
                             label="Last Name"
                             initialValue={profile.lastName}
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
                             initialValue={profile.email}
                             rules={[
                               {type: 'email', message: 'The input is not valid E-mail!'},
                               {required: true, message: 'Please input an E-mail!'}
                             ]}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormButtonBar>
                    <Button type="primary" htmlType="submit">Save</Button>
                  </FormButtonBar>
                </Col>
              </Row>
            </Form>
          </Card>
      );
    } else {
      return <div></div>;
    }
  }

  private _loadProfile(): void {
    const {promise, subscription} = makeCancelable(this.props.loggedInUserService.getLoggedInUser());
    this._profileSubscription = subscription;
    promise.then(profile => {
      this._profileSubscription = null;
      this.setState({profile});
    }).catch(err => {
      this._profileSubscription = null;
      this.setState({profile: null});
    });
  }

  private handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this._formRef.current!.validateFields().then(values => {
        const {username, displayName, firstName, lastName, email} = values;
        const profile = new UserProfile(
            username,
            displayName,
            firstName,
            lastName,
            email
        );
        this.props.loggedInUserService.updateProfile(profile)
            .then(() => {
              notification["success"]({
                message: 'Success',
                description: `Your profile was successfully updated.`
              });
            }).catch((err) => {
          console.log(err)
          notification["error"]({
            message: 'Could Not Update Profile',
            description: `Your user profile could not be updated.`
          });


        });
    });
  }
}

export const ProfileForm = injectAs<ProfileFormProps>([SERVICES.LOGGED_IN_USER_SERVICE], ProfileFormComponent);
