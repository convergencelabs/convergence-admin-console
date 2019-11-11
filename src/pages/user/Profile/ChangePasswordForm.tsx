import * as React from 'react';
import {ReactNode} from 'react';
import {Card, Icon, notification} from "antd";
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {LoggedInUserService} from "../../../services/LoggedInUserService";
import {ConvergenceUserPasswordForm} from "../../../components/common/ConvergenceUserPasswordForm";

interface InjectedProps extends FormComponentProps {
  loggedInUserService: LoggedInUserService;
}

class ChangePasswordFormComponent extends React.Component<InjectedProps, {}> {

  public render(): ReactNode {
    return (
      <Card title={<span><Icon type="lock"/> Change Password</span>} className={styles.setPassword}>
        <ConvergenceUserPasswordForm
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
          });
          return false;
        }
      );
  }
}

const injections = [SERVICES.LOGGED_IN_USER_SERVICE];
export const ChangePasswordForm = injectAs<{}>(injections, ChangePasswordFormComponent);
