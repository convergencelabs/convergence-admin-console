/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ReactNode} from "react";
import {Button, Col, Form, Input, notification, Row} from "antd";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainId} from "../../../../models/DomainId";
import {FormButtonBar} from "../../../common/FormButtonBar";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainConfigService} from "../../../../services/domain/DomainConfigService";
import {ReconnectConfig} from "../../../../models/domain/ReconnectConfig";

export interface ReconnectSettingsProps {
  domainId: DomainId;
}

interface InjectedProps extends ReconnectSettingsProps {
  domainConfigService: DomainConfigService;
}

export interface ReconnectSettingsState {
  initialValue: ReconnectConfig | null;
}

class ReconnectSettingsForm extends React.Component<InjectedProps, ReconnectSettingsState> {
  private _subscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      initialValue: null
    }

    this._subscription = null;

    this._loadConfig();
  }

  public componentWillUnmount(): void {
    if (this._subscription !== null) {
      this._subscription.unsubscribe();
    }
  }

  public render(): ReactNode {
    if (this.state.initialValue !== null) {
      return (
          <Form layout="vertical" onFinish={this._handleSubmit}>
            <Row>
              <Col span={24}>
                <Form.Item name="tokenValidity"
                           label="Reconnect Token Validity (minutes)"
                           initialValue={this.state.initialValue.tokenValidity}
                           rules={[{required: true, message: "A reconnect token validity value is required!"}]}
                >
                  <Input type="number" placeholder="Enter" min="1"/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormButtonBar>
                  <Button type="primary" htmlType="submit">Apply</Button>
                </FormButtonBar>
              </Col>
            </Row>
          </Form>
      );
    } else {
      return null;
    }
  }

  private _handleSubmit = (values: any) => {
    const {tokenValidity} = values;
    this.props.domainConfigService.setReconnectConfig(this.props.domainId, new ReconnectConfig(Number(tokenValidity)))
        .then(() => {
          notification.success({
            message: 'Reconnect Config Updated',
            description: `The domain reconnect config successfully updated.`
          });
        })
        .catch((_) => {
          notification.error({
            message: 'Could Not Update Config',
            description: `The reconnect configuration could not be updated.`
          });
        });
  }

  private _loadConfig = () => {
    const {promise, subscription} = makeCancelable(
        this.props.domainConfigService.getReconnectConfig(this.props.domainId));
    this._subscription = subscription;
    promise.then(config => {
          this.setState({initialValue: config});
          this._subscription = null;
        }
    );
  }
}

const injections = [SERVICES.DOMAIN_CONFIG_SERVICE];
export const ReconnectSettings = injectAs<ReconnectSettingsProps>(injections, ReconnectSettingsForm);