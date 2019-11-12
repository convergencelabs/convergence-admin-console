/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import * as React from 'react';
import {FormEvent, ReactNode} from 'react';
import {Button, Card, Col, Form, Icon, Input, notification, Row, Tooltip} from "antd";
import {FormComponentProps} from "antd/lib/form";
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

interface InjectedProps extends ProfileFormProps, FormComponentProps {
  loggedInUserService: LoggedInUserService;
}

export interface EditUserState {
  profile: UserProfile | null
}

class ProfileFormComponent extends React.Component<InjectedProps, EditUserState> {

  private _profileSubscription: PromiseSubscription | null;

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
    const {getFieldDecorator} = this.props.form;
    if (this.state.profile !== null) {
      const profile = this.state.profile;
      return (
          <Card title={<span><Icon type="user"/> Edit User</span>} className={styles.formCard}>
            <Form onSubmit={this.handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Username">
                    {getFieldDecorator('username', {
                      initialValue: profile.username,
                      rules: [{
                        required: true, whitespace: true, message: 'Please input a Username!',
                      }],
                    })(
                      <Input disabled={true}/>
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
                      initialValue: profile.displayName,
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
                      initialValue: profile.firstName,
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
                      initialValue: profile.lastName,
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
                      initialValue: profile.email,
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
    const {promise, subscription} = makeCancelable(this.props.loggedInUserService.getProfile());
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
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
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
      }
    });
  }
}

export const ProfileForm = injectAs<ProfileFormProps>([SERVICES.LOGGED_IN_USER_SERVICE], Form.create()(ProfileFormComponent));
