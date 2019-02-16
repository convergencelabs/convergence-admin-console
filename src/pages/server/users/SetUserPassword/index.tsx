import * as React from 'react';
import {Page} from "../../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../../stores/BreacrumStore";
import {Card, notification, Tag} from "antd";
import {Form, Icon} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {UserService} from "../../../../services/UserService";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {SetPasswordForm} from "../../../../components/SetPasswordForm/"
import {RestError} from "../../../../services/RestError";

interface InjectedProps extends RouteComponentProps<{ username: string }>, FormComponentProps {
  userService: UserService;
}

interface SetUserPasswordState {

}

class SetUserPasswordComponent extends React.Component<InjectedProps, SetUserPasswordState> {
  private readonly _breadcrumbs: BasicBreadcrumbsProducer;

  constructor(props: InjectedProps) {
    super(props);

    const username = this.props.match.params.username;
    this._breadcrumbs = new BasicBreadcrumbsProducer([
      {title: "Users", link: "/users"},
      {title: username},
      {title: "Set Password"}
    ]);
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs.breadcrumbs()}>
        <Card title={<span><Icon type="user"/> <Tag>{this.props.match.params.username}</Tag> Set Password</span>}
              className={styles.formCard}>
          <SetPasswordForm
            onSetPassword={this._handleSetPassword}
            onCancel={this._handleCancel}
            showCancel={true}
          />
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    this.props.history.push("/users/");
  }

  private _handleSetPassword = (password: string) => {
    const username = this.props.match.params.username;
    return this.props.userService.setPassword(username, password)
      .then(() => {
        notification["success"]({
          message: 'namespaces Created',
          description: `Password for '${username}' successfully set.`
        });
        this.props.history.push("/users/");
        return true;
      }).catch((err) => {
      console.error(err);
      if (err instanceof RestError) {
        notification.error({
          message: 'Could Not Set Password',
          description: `The password for ${username} could not be set.`
        });
      }

      return false;
    });
  }
}

export const SetUserPassword = injectAs<RouteComponentProps>([SERVICES.USER_SERVICE], Form.create<{}>()(SetUserPasswordComponent));
