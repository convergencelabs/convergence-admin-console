import React, {ReactNode} from 'react';
import {Page} from "../../../../components/common/Page/";
import {Card, Form, Icon, notification, Tag} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {SetPasswordForm} from "../../../../components/common/SetPasswordForm/"
import {RestError} from "../../../../services/RestError";
import {DomainId} from "../../../../models/DomainId";
import {DomainUserService} from "../../../../services/domain/DomainUserService";
import {toDomainRoute} from "../../../../utils/domain-url";
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";
import styles from "./styles.module.css";
import {PasswordConfig} from "../../../../models/PasswordConfig";

export interface SetDomainUserPasswordProps extends RouteComponentProps<{ username: string }> {
  domainId: DomainId;
}

interface InjectedProps extends SetDomainUserPasswordProps, FormComponentProps {
  domainUserService: DomainUserService;
}

class SetDomainUserPasswordComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs: IBreadcrumbSegment[];

  constructor(props: InjectedProps) {
    super(props);

    const username = this.props.match.params.username;
    this._breadcrumbs = [
      {title: "Users", link: toDomainRoute(this.props.domainId, "users")},
      {title: username, link: toDomainRoute(this.props.domainId, `users/${username}`)},
      {title: "Set Password"}
    ];
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="user"/> <Tag>{this.props.match.params.username}</Tag> Set Password</span>}
              className={styles.formCard}>
          <SetPasswordForm
            passwordConfig={PasswordConfig.PERMISSIVE}
            onSetPassword={this._handleSetPassword}
            onCancel={this._handleCancel}
            showCancel={true}
          />
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    this.props.history.push(toDomainRoute(this.props.domainId, "users"));
  }

  private _handleSetPassword = (password: string) => {
    const username = this.props.match.params.username;
    return this.props.domainUserService.setPassword(this.props.domainId, username, password)
      .then(() => {
        notification.success({
          message: 'Password Changed',
          description: `Password for '${username}' successfully set.`
        });
        this.props.history.push(toDomainRoute(this.props.domainId, "users"));
        return false;
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

const injections = [SERVICES.DOMAIN_USER_SERVICE];
export const SetDomainUserPassword = injectAs<SetDomainUserPasswordProps>(injections, Form.create()(SetDomainUserPasswordComponent));
