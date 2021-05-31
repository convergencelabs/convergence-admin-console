/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {FormEvent, ReactNode} from "react";
import {Button, Form, FormInstance, Input, notification, Select} from "antd";
import {FormFieldWithHelp} from "../../../components/common/FormFieldWithHelp/";
import {FormButtonBar} from "../../../components/common/FormButtonBar/";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {ConfigService} from "../../../services/ConfigService";
import {CONFIG} from "../../../constants/config";
import {NamespaceConfig} from "../../../models/NamespaceConfig";
import {STORES} from "../../../stores/StoreConstants";
import {ConfigStore} from "../../../stores/ConfigStore";

const {Option} = Select;

interface InjectedProps {
  configService: ConfigService;
  configStore: ConfigStore;
}

interface NamespaceAndDomainSettingsState {
  configs: Map<string, any> | null;
  namespacesEnabled: boolean;
}

const ENABLED = "enabled";
const DISABLED = "disabled";

class NamespaceSettingsComponent extends React.Component<InjectedProps, NamespaceAndDomainSettingsState> {
  private _configSubscription: PromiseSubscription | null;
  private _formRef = React.createRef<FormInstance>();

  constructor(props: InjectedProps) {
    super(props);

    this._configSubscription = null;

    this.state = {
      configs: null,
      namespacesEnabled: this.props.configStore.namespacesEnabled
    };

    this._loadConfig();
  }

  public render(): ReactNode {
    if (this.state.configs !== null) {
      const namespacesEnabled = this.state.configs.get(CONFIG.Namespaces.Enabled) ? ENABLED : DISABLED;
      const userNamespacesEnabled = this.state.configs.get(CONFIG.Namespaces.UserNamespacesEnabled) ? ENABLED : DISABLED;
      const defaultNamespace = this.state.configs.get(CONFIG.Namespaces.DefaultNamespace);

      return (
          <Form ref={this._formRef} onFinish={this._handleSubmit} layout="horizontal">
            <Form.Item name="namespacesEnabled"
                       label={(
                           <FormFieldWithHelp
                               label="Namespaces"
                               tooltip="Determines if the server will allow grouping related domains into namespaces."
                           />
                       )}
                       initialValue={namespacesEnabled}
            >
              <Select onChange={(val: string) => this.setState({namespacesEnabled: val === ENABLED})}>
                <Option key={ENABLED} value={ENABLED}>Enabled</Option>
                <Option key={DISABLED} value={DISABLED}>Disabled</Option>
              </Select>
            </Form.Item>
            <Form.Item name="userNamespacesEnabled"
                       label={(
                           <FormFieldWithHelp
                               label="User Namespaces"
                               tooltip={
                                 `Determines if each user has an implicit namespace in which to create domains. This option requires namespaces to be enabled.`
                               }
                           />
                       )}
                       initialValue={userNamespacesEnabled}
            >
              <Select disabled={!this.state.namespacesEnabled}>
                <Option key={ENABLED} value={ENABLED}>Enabled</Option>
                <Option key={DISABLED} value={DISABLED}>Disabled</Option>
              </Select>
            </Form.Item>
            <Form.Item name="defaultNamespace"
                       label={(
                           <FormFieldWithHelp
                               label="Default Namespaces"
                               tooltip={
                                 `The default namespace domains will be created in. This namespace will automatically be created and can not be deleted. This is a required field if namespaces are disabled.`
                               }
                           />
                       )}
                       initialValue={defaultNamespace}
            >
              <Input/>
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

  private _handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this._formRef.current!.validateFields().then(values => {
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
    });
  }

  private _loadConfig(): void {
    const {promise, subscription} = makeCancelable(this.props.configService.getConfig());
    this._configSubscription = subscription;
    promise.then(configs => {
      this._configSubscription = null;
      this.setState({configs});
    }).catch(_ => {
      this._configSubscription = null;
      this.setState({configs: null});
    });
  }
}

const injections = [SERVICES.CONFIG_SERVICE, STORES.CONFIG_STORE];
export const NamespaceSettings = injectAs<{}>(injections, NamespaceSettingsComponent);
