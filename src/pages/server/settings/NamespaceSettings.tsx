import React, {ReactNode} from "react";
import {Button, Form, Input, notification, Select} from "antd";
import {FormFieldWithHelp} from "../../../components/common/FormFieldWithHelp/";
import {FormButtonBar} from "../../../components/common/FormButtonBar/";
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {ConfigService} from "../../../services/ConfigService";
import {CONFIG} from "../../../constants/config";
import {NamespaceConfig} from "../../../models/NamespaceConfig";
import {STORES} from "../../../stores/StoreConstants";
import {ConfigStore} from "../../../stores/ConfigStore";

const {Option} = Select;

interface InjectedProps extends FormComponentProps {
  configService: ConfigService;
  configStore: ConfigStore;
}

interface NamespaceAndDomainSettingsState {
  configs: Map<string, any> | null;
}

const ENABLED = "enabled";
const DISABLED = "disabled";

class NamespaceSettingsComponent extends React.Component<InjectedProps, NamespaceAndDomainSettingsState> {

  private _configSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._configSubscription = null;

    this.state = {
      configs: null
    };

    this._loadConfig();
  }

  public render(): ReactNode {
    if (this.state.configs !== null) {
      const {getFieldDecorator} = this.props.form;
      const namespacesEnabled = this.state.configs.get(CONFIG.Namespaces.Enabled) ? ENABLED : DISABLED;
      const userNamespacesEnabled = this.state.configs.get(CONFIG.Namespaces.UserNamespacesEnabled) ? ENABLED : DISABLED;
      const defaultNamespace = this.state.configs.get(CONFIG.Namespaces.DefaultNamespace);

      return (
        <Form onSubmit={this._handleSubmit} layout="horizontal">
          <Form.Item label={(
            <FormFieldWithHelp
              label="Namespaces"
              tooltip="Determines if the server will allow grouping related domains into namespaces."
            />
          )}>
            {getFieldDecorator('namespacesEnabled', {
              initialValue: namespacesEnabled,
              rules: []
            })(
              <Select>
                <Option key={ENABLED} value={ENABLED}>Enabled</Option>
                <Option key={DISABLED} value={DISABLED}>Disabled</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label={(
            <FormFieldWithHelp
              label="User Namespaces"
              tooltip={
                `Determines if each user has an implicit namespace in which to create domains.
               This option requires namespaces to be enabled.`
              }
            />
          )}>
            {getFieldDecorator('userNamespacesEnabled', {
              initialValue: userNamespacesEnabled,
              rules: []
            })(
              <Select>
                <Option key={ENABLED} value={ENABLED}>Enabled</Option>
                <Option key={DISABLED} value={DISABLED}>Disabled</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label={(
            <FormFieldWithHelp
              label="Default Namespaces"
              tooltip={
                `The default namespace domains will be created in.
               This namespace will automatically be created and can not be deleted.
               This is a required field if namespaces are disabled.`
              }
            />
          )}>
            {getFieldDecorator('defaultNamespace', {
              rules: [],
              initialValue: defaultNamespace,
            })(
              <Input/>
            )}
          </Form.Item>
          <FormButtonBar>
            <Button type="primary" htmlType="submit">Save</Button>
          </FormButtonBar>
        </Form>
      );
    } else {
      return null;
    }
  }

  public componentWillUnmount(): void {
    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
    }
  }

  private _handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {defaultNamespace, namespacesEnabled, userNamespacesEnabled} = values;
        const config = new NamespaceConfig(
          namespacesEnabled === ENABLED,
          userNamespacesEnabled === ENABLED,
          defaultNamespace
        );
        this.props.configService
          .setNamespaceConfig(config)
          .then(() => {
            this.props.configStore.setDefaultNamespace(defaultNamespace);
            this.props.configStore.setNamespacesEnabled(namespacesEnabled === ENABLED);
            this.props.configStore.setUserNamespacesEnabled(userNamespacesEnabled === ENABLED);
            notification.success({
              message: "Configuration Saved",
              description: "Namespace configuration successfully saved."
            })
          })
          .catch(err => {
            console.error(err);
            notification.error({
              message: "Configuration Not Saved",
              description: "Namespace  configuration could not be saved."
            })
          });
      }
    });
  }

  private _loadConfig(): void {
    const {promise, subscription} = makeCancelable(this.props.configService.getConfig());
    this._configSubscription = subscription;
    promise.then(configs => {
      this._configSubscription = null;
      this.setState({configs});
    }).catch(err => {
      this._configSubscription = null;
      this.setState({configs: null});
    });
  }
}

const injections = [SERVICES.CONFIG_SERVICE, STORES.CONFIG_STORE];
export const NamespaceSettings = injectAs<{}>(injections, Form.create<{}>()(NamespaceSettingsComponent));
