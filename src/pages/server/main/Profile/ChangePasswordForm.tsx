import * as React from 'react';
import {ReactNode} from "react";
import {Card, notification} from "antd";
import {Icon} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {LoggedInUserService} from "../../../../services/LoggedInUserService";
import {SetPasswordForm} from "../../../../components/SetPasswordForm/index";

interface InjectedProps extends FormComponentProps {
  loggedInUserService: LoggedInUserService;
}

class ChangePasswordFormComponent extends React.Component<InjectedProps, {}> {

  public render(): ReactNode {
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
    return this.props.loggedInUserService
      .setPassword(password)
      .then(() => {
          notification.success({
            message: "Success",
            description: "Your password was successfully updated."
          });
          return true;
        }
      )
      .catch(() => {
          notification.success({
            message: "Error",
            description: "Your password could not be set."
          })
          return false;
        }
      );
  }
}

export const ChangePasswordForm = injectAs<{}>([SERVICES.LOGGED_IN_USER_SERVICE], ChangePasswordFormComponent);
