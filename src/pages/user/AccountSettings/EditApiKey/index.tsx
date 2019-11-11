import * as React from 'react';
import {ReactNode} from 'react';
import {Page} from "../../../../components/common/Page";
import {Card, Form, Icon, notification} from "antd";
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {ApiKeyService} from "../../../../services/ApiKeyService";
import {ApiKeyForm} from "../../../../components/user/ApiKeyForm";
import {UserApiKey} from "../../../../models/UserApiKey";
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";

interface InjectedProps extends RouteComponentProps, FormComponentProps {
  apiKeyService: ApiKeyService;
}

interface EditApiKeyState {
  apiKey: UserApiKey | null;
}

class EditApiKeyComponent extends React.Component<InjectedProps, EditApiKeyState> {
  private readonly _breadcrumbs: IBreadcrumbSegment[];

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      apiKey: null
    };

    const keyId = (props.match.params as any).key;
    this._breadcrumbs = [
      {title: "Account Settings", link: "/account-settings"},
      {title: "API Keys"},
      {title: keyId}
    ];

    this.props.apiKeyService.getApiKey(keyId).then(apiKey => {
      this.setState({apiKey});
    });
  }

  public render(): ReactNode {
    const {apiKey} = this.state;
    if (apiKey === null) {
      return <div/>;
    } else {
      return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><Icon type="key"/> Update API Key</span>} className={styles.formCard}>
            <ApiKeyForm initialValue={apiKey}
                        saveButtonLabel="Update"
                        onCancel={this._handleCancel}
                        onSave={this._handleSubmit}
            />
          </Card>
        </Page>
      );
    }
  }

  private _handleCancel = () => {
    this.props.history.push("/account-settings/");
  }

  private _handleSubmit = (data: { name: string, enabled: boolean }) => {
    this.props.apiKeyService.updateUserApiKey(this.state.apiKey!.key, data.name, data.enabled)
      .then(() => {
        notification.success({
          message: 'API Key Updated',
          description: `API Key '${data.name}' successfully updated`,
          placement: "bottomRight",
          duration: 3
        });
        this.props.history.push("/account-settings");
      }).catch((err) => {
      if (err instanceof RestError) {
        console.log(JSON.stringify(err));
        if (err.code === "duplicate") {
          notification["error"]({
            message: 'Could Not Update API Key',
            description: `An API Key with the specified ${err.details["field"]} already exists.`,
            placement: "bottomRight"
          });
        }
      }
    });
  }
}

export const EditApiKey = injectAs<RouteComponentProps>([SERVICES.API_KEY_SERVICE], Form.create()(EditApiKeyComponent));
