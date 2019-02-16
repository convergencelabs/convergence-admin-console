import * as React from 'react';
import {Page} from "../../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../../stores/BreacrumStore";
import {Card, Col, notification, Row} from "antd";
import {Form, Input, Tooltip, Icon, Button, Select} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/FormButtonBar/";
import {CreateUserData, UserService} from "../../../../services/UserService";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {ConfigService} from "../../../../services/ConfigService";
import {PromiseSubscription} from "../../../../utils/make-cancelable";
import {PasswordConfig} from "../../../../models/PasswordConfig";
import {PasswordFormValidator} from "../../../../utils/PasswordFormValidator";

const {Option} = Select;

interface InjectedProps extends RouteComponentProps, FormComponentProps {
  userService: UserService;
  configService: ConfigService;
}

interface CreateUserComponentState {
  confirmDirty: boolean;
  passwordConfig: PasswordConfig | null;
}

class CreateUserComponent extends React.Component<InjectedProps, CreateUserComponentState> {
  private readonly _breadcrumbs:BasicBreadcrumbsProducer;

  private _configSubscription: PromiseSubscription | null;
  private _passwordValidator = new PasswordFormValidator();

  constructor(props: InjectedProps) {
    super(props);

    this._breadcrumbs = new BasicBreadcrumbsProducer([
      {title: "Users", link: "/users"},
      {title: "New User"}
    ]);

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
    const {getFieldDecorator} = this.props.form;
    if (this.state.passwordConfig !== null) {
      return (
        <Page breadcrumbs={this._breadcrumbs.breadcrumbs()}>
          <Card title={<span><Icon type="user"/> New User</span>} className={styles.formCard}>
            <Form onSubmit={this._handleSubmit}>
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
                {getFieldDecorator('serverRole', {
                  initialValue: "Developer",
                  rules: [{type: 'string', required: true, message: 'Please select a role!'}],
                })(
                  <Select>
                    <Option value="Developer">Developer</Option>
                    <Option value="Domain Admin">Domain Admin</Option>
                    <Option value="Server Admin">Server Admin</Option>
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
    } else {
      return null;
    }
  }

  private _handleCancel = () => {
    this.props.history.push("/users/");
  }

  private _handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
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
        this.props.userService.createUser(userData)
          .then(() => {
            notification.success({
              message: 'namespaces Created',
              description: `User '${username}' successfully created`
            });
            this.props.history.push("/users");
          }).catch((err) => {
          if (err instanceof RestError) {
            if (err.code === "duplicate") {
              notification.error({
                message: 'Could Not Create namespaces',
                description: `A user with the specified ${err.details["field"]} already exists.`
              });
            }
          }
        });
      }
    });
  }

  public componentWillUnmount(): void {
    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
      this._configSubscription = null;
    }
  }

  private handleConfirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }

  private compareToFirstPassword = (rule: any, value: any, callback: (error?: string) => void) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('The passwords do not match!');
    } else {
      callback();
    }
  }

  private validateToNextPassword = (rule: any, value: any, callback: (error?: string) => void) => {
    if (this._passwordValidator.validatePassword(this.state.passwordConfig!, value, callback)) {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], {force: true});
      }
      callback();
    }
  }
}

const injections = [SERVICES.USER_SERVICE, SERVICES.CONFIG_SERVICE];
export const CreateUser = injectAs<RouteComponentProps>(injections, Form.create<{}>()(CreateUserComponent));