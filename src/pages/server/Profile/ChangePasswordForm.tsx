import * as React from 'react';
import {ReactNode} from "react";
import {Card, notification} from "antd";
import {Form, Icon} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {LoggedInUserService} from "../../../services/LoggedInUserService";
import {SetPasswordForm} from "../../../components/SetPasswordForm";

interface InjectedProps extends FormComponentProps {
  loggedInUserService: LoggedInUserService;
}

interface ChangePasswordFormState {
  confirmDirty: boolean;
}

class ChangePasswordFormComponent extends React.Component<InjectedProps, ChangePasswordFormState> {
  state = {
    confirmDirty: false
  };

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Card title={<span><Icon type="lock"/> Change Password</span>} className={styles.setPassword}>
        <SetPasswordForm
          onSetPassword={this._handleSetPassword}
          showCancel={false}
        />
      </Card>
    );
  }

  private _handleSetPassword = (password: string) => {
    this.props.loggedInUserService
      .setPassword(password)
      .then(() => {
          notification.success({
            message: "Success",
            description: "Your password was successfully updated."
          });
          this.props.form.setFieldsValue({
            password: "",
            confirm: ""
          });
        }
      )
      .catch(() =>
        notification.success({
          message: "Error",
          description: "Your password could not be set."
        })
      );
  }
}

export const ChangePasswordForm = injectAs<{}>([SERVICES.LOGGED_IN_USER_SERVICE], Form.create<{}>()(ChangePasswordFormComponent));
