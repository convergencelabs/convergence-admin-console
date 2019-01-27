import React, {Component, FormEvent, ReactNode} from 'react';
import {Redirect, RouteComponentProps} from "react-router";
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import styles from "./styles.module.css";
import logo from "../../assets/images/logo.png";
import {authService} from "../../services/AuthService";
import {authStore} from "../../stores/AuthStore";
import {localStorageService} from "../../services/LocalStorageService";

export interface LoginFormState {
  redirectToReferrer: boolean;
  errorMessage: string | null;
}

class NormalLoginForm extends Component<RouteComponentProps & FormComponentProps, LoginFormState> {
  state = {
    redirectToReferrer: false,
    errorMessage: null
  };

  handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {username, password} = values;
        authService.login(username, password)
          .then(resp => {
            const {token, expiration} = resp;
            authStore.setAuthenticated(resp.token);

            this.setState({
              redirectToReferrer: true,
              errorMessage: null
            });

            localStorageService.setAuthToken({token, expires: expiration});
          })
          .catch(err => {
            console.log(err);
            this.setState({
              errorMessage: "Invalid credentials"
            })
          });
      }
    });
  }

  render(): ReactNode {
    let {from} = this.props.location.state || {from: {pathname: "/"}};
    if (from.pathname === "/login") {
      from = {pathname: "/"};
    }
    const {redirectToReferrer} = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from}/>;
    }

    const {getFieldDecorator} = this.props.form;

    const error = this.state.errorMessage ?
      <div className={styles.error}><Icon type="warning"/>{this.state.errorMessage}</div> :
      null;

    return (
      <div className={styles.loginContainer}>
        <div className={styles.header}>
          <img className={styles.logo} src={logo}/>
          <div className={styles.title}>Convergence</div>
        </div>
        <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
          <Form.Item>
            {getFieldDecorator('username', {
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
          {error}
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

export const LoginForm = Form.create<{}>()(NormalLoginForm);
