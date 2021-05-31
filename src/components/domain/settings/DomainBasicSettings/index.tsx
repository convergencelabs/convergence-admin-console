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
import {Button, Col, Form, FormInstance, Input, notification, Row} from "antd";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainId} from "../../../../models/DomainId";
import {FormButtonBar} from "../../../common/FormButtonBar";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainService} from "../../../../services/DomainService";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";

export interface DomainBasicSettingsFormProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainBasicSettingsFormProps {
  domainService: DomainService;
}

export interface DomainBasicSettingsFormState {
  initialValue: DomainDescriptor | null;
}

class DomainBasicSettingsForm extends React.Component<InjectedProps, DomainBasicSettingsFormState> {
  private _formRef = React.createRef<FormInstance>();
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
        <Form ref={this._formRef} onFinish={this._handleSubmit}>
          <Row>
            <Col span={24}>
              <Form.Item name="displayName"
                         label="Display Name"
                         initialValue={this.state.initialValue.displayName}
                         rules={[{required: true, message: "A display name is required!"}]}
              >
                  <Input placeholder="Enter a Display Name"/>
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

  private _handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this._formRef.current!.validateFields().then(values => {
        const {displayName} = values;
        this.props.domainService.updateDomain(this.props.domainId, displayName)
          .then(() => {
            notification.success({
              message: 'Domain Info Updated',
              description: `The domain info was successfully updated.`
            });
          })
          .catch((_) => {
            notification.error({
              message: 'Could Not Update Domain',
              description: `The domain info could not be updated.`
            });
          });
    });
  }

  private _loadConfig = () => {
    const {promise, subscription} = makeCancelable(
      this.props.domainService.getDomain(this.props.domainId));
    this._subscription = subscription;
    promise.then(domain => {
        this.setState({initialValue: domain});
        this._subscription = null;
      }
    );
  }
}

const injections = [SERVICES.DOMAIN_SERVICE];
export const DomainBasicSettings = injectAs<DomainBasicSettingsFormProps>(injections, DomainBasicSettingsForm);