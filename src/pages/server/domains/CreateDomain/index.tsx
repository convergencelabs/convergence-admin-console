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
import {Page} from "../../../../components/common/Page/";
import {Button, Card, Col, Form, Icon, Input, notification, Radio, Row} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {FormFieldWithHelp} from "../../../../components/common/FormFieldWithHelp/";
import {NamespaceAutoComplete} from "../../../../components/server/NamespaceAutoComplete";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainService} from "../../../../services/DomainService";
import RadioGroup from "antd/es/radio/group";
import {ProfileStore} from "../../../../stores/ProfileStore";
import {STORES} from "../../../../stores/StoreConstants";
import {RestError} from "../../../../services/RestError";
import {DomainId} from "../../../../models/DomainId";
import styles from "./styles.module.css";
import {ConfigStore} from "../../../../stores/ConfigStore";

export interface CreateDomainState {
  confirmDirty: boolean;
  namespaceType: string;
}

interface InjectedProps extends RouteComponentProps, FormComponentProps {
  profileStore: ProfileStore;
  domainService: DomainService;
  configStore: ConfigStore;
}

const USER = "user";
const SHARED = "shared";

class CreateDomainComponent extends React.Component<InjectedProps, CreateDomainState> {
  private readonly _breadcrumbs = [
    {title: "Domains", link: "/domains"},
    {title: "New Domain"}
  ];

  state = {
    confirmDirty: false,
    namespaceType: this.props.configStore.userNamespacesEnabled ? USER : SHARED
  };

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="database"/> New Domain</span>} className={styles.formCard}>
          <Form onSubmit={this._handleSubmit}>
            {
              this.props.configStore.namespacesEnabled && this.props.configStore.userNamespacesEnabled ?
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item label="Create In">
                      {getFieldDecorator('namespaceType', {
                        rules: [{required: true, message: 'Please input a domain id!', whitespace: true}],
                        initialValue: this.state.namespaceType
                      })(
                        <RadioGroup onChange={val => {
                          this.setState({namespaceType: val.target.value})
                        }}>
                          <Radio value={USER}>User Namespace</Radio>
                          <Radio value={SHARED}>Shared Namespace</Radio>
                        </RadioGroup>
                      )}
                    </Form.Item>
                  </Col>
                </Row> :
                null
            }
            {
              this.props.configStore.namespacesEnabled && this.state.namespaceType !== "user" ?
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item label="Shared Namespace">
                      {getFieldDecorator('namespace', {
                        rules: [{
                          required: this.state.namespaceType !== USER,
                          whitespace: true,
                          message: 'Please select a namespace!',
                        }],
                      })(
                        <NamespaceAutoComplete disabled={this.state.namespaceType === USER}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                : null
            }
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={(
                  <FormFieldWithHelp
                    label="Domain Id"
                    tooltip="The url friendly id that will be used to connect to the domain."
                  />
                )}>
                  {getFieldDecorator('id', {
                    rules: [{required: true, message: 'Please input a domain id!', whitespace: true}],
                  })(
                    <Input placeholder="Enter a unique id"/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={(
                  <FormFieldWithHelp
                    label="Display Name"
                    tooltip="A nickname that will be displayed in the admin console."
                  />
                )}>
                  {getFieldDecorator('displayName', {
                    rules: [{
                      required: true, whitespace: true, message: 'Please input a display name!',
                    }],
                  })(
                    <Input placeholder="Enter an optional display name"/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormButtonBar>
                  <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit">Create</Button>
                </FormButtonBar>
              </Col>
            </Row>
          </Form>
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    this.props.history.push("/domains/");
  }

  private _handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {namespace, id, displayName, namespaceType} = values;
        let ns: string;

        if (this.props.configStore.namespacesEnabled) {
          ns = namespaceType === USER ?
            "~" + this.props.profileStore.profile!.username :
            namespace;
        } else {
          ns = this.props.configStore.defaultNamespace;
        }

        this.props.domainService
          .createDomain(new DomainId(ns, id), displayName)
          .then(() => {
            notification.success({
              message: "Domain Created",
              description: `The domain '${ns}/${id}' was successfully created.`
            });
            this.props.history.push("/domains/");
          })
          .catch(err => {
            let message;
            if (err instanceof RestError && err.code === "namespace_not_found") {
              message = `The domain could not be created because the namespace '${err.details['namespace']}' does not exist`;
            } else {
              message = "The domain could not be created."
            }
            notification.error({
              message: "Domain Not Created",
              description: message
            });
          });
      }
    });
  }
}

const injections = [SERVICES.DOMAIN_SERVICE, STORES.PROFILE_STORE, STORES.CONFIG_STORE];
export const CreateDomain = injectAs<RouteComponentProps>(injections, Form.create()(CreateDomainComponent));
