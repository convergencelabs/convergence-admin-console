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
import {ConvergenceUser} from "../../../../models/ConvergenceUser";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";

const {Option} = Select;

interface InjectedProps extends RouteComponentProps<{ username: string }>, FormComponentProps {
  userService: UserService;
}

interface EditUserState {
  user: ConvergenceUser | null
}

class EditUserComponent extends React.Component<InjectedProps, EditUserState> {
  private readonly _breadcrumbs: BasicBreadcrumbsProducer;
  private _userSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    const username = this.props.match.params.username;
    this._breadcrumbs = new BasicBreadcrumbsProducer([
      {title: "Users", link: "/users"},
      {title: username}
    ]);

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
    const {getFieldDecorator} = this.props.form;
    if (this.state.user !== null) {
      const user = this.state.user;
      return (
        <Page breadcrumbs={this._breadcrumbs.breadcrumbs()}>
          <Card title={<span><Icon type="user"/> Edit User</span>} className={styles.formCard}>
            <Form onSubmit={this.handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Username">
                    {getFieldDecorator('username', {
                      initialValue: user.username,
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
                      initialValue: user.displayName,
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
                      initialValue: user.firstName,
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
                      initialValue: user.lastName,
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
                      initialValue: user.email,
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
                  initialValue: user.serverRole,
                  rules: [{type: 'string', required: true, message: 'Please select a role!'}],
                })(
                  <Select>
                    <Option value="Developer">Developer</Option>
                    <Option value="Domain Admin">Domain Admin</Option>
                    <Option value="Server Admin">Server Admin</Option>
                  </Select>
                )}
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

  private handleSubmit = (e: FormEvent<HTMLInputElement>) => {
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
              message: 'User Updated',
              description: `User '${username}' successfully updated`
            });
            this.props.history.push("./");
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
      }
    });
  }
}

export const EditUser = injectAs<RouteComponentProps>([SERVICES.USER_SERVICE], Form.create<{}>()(EditUserComponent));
