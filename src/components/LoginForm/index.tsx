import React, {Component, FormEvent, ReactNode} from 'react';
import {Redirect, RouteComponentProps} from "react-router";
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import styles from "./login.module.css";
import logo from "../../assets/images/logo.png";

export interface LoginFormProps extends RouteComponentProps {
  loginSuccess: () => void;
}

export interface LoginFormState {
  redirectToReferrer: boolean;
}

class NormalLoginForm extends Component<LoginFormProps & FormComponentProps, LoginFormState> {
  state = {
    redirectToReferrer: false
  };

  handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        this.setState({
          redirectToReferrer: true
        });

        this.props.loginSuccess();
      }
    });
  }

  render(): ReactNode {
    const {from} = this.props.location.state || {from: {pathname: "/"}};
    const {redirectToReferrer} = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from}/>;
    }

    const {getFieldDecorator} = this.props.form;
    return (
      <div className={styles.loginContainer}>
        <div className={styles.header}>
          <img className={styles.logo} src={logo}/>
          <div className={styles.title}>Convergence</div>
        </div>
        <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [{required: true, message: 'Please input your username!'}],
            })(
              <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username"/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{required: true, message: 'Please input your Password!'}],
            })(
              <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                     placeholder="Password"/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )}
            <a className={styles.loginFormForgot} href="">Forgot password</a>
            <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export const LoginForm = Form.create<LoginFormProps>()(NormalLoginForm);
