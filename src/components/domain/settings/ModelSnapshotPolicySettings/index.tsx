/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {FormEvent, ReactNode} from "react";
import {Button, Col, Form, notification, Row} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainId} from "../../../../models/DomainId";
import {ModelSnapshotPolicyFormFragment} from "../../common/ModelSnapshotPolicyFormFragment";
import {ModelSnapshotPolicy} from "../../../../models/domain/ModelSnapshotPolicy";
import {FormButtonBar} from "../../../common/FormButtonBar";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainConfigService} from "../../../../services/domain/DomainConfigService";
import {RestError} from "../../../../services/RestError";

export interface ModelSnapshotPolicySettingsProps {
  domainId: DomainId;
}

interface InjectedProps extends ModelSnapshotPolicySettingsProps, FormComponentProps {
  domainConfigService: DomainConfigService;
}

export interface ModelSnapshotPolicySettingsComponentState {
  initialValue: ModelSnapshotPolicy | null;
}

class ModelSnapshotPolicySettingsComponent extends React.Component<InjectedProps, ModelSnapshotPolicySettingsComponentState> {
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
        <Form onSubmit={this._handleSubmit}>
          <ModelSnapshotPolicyFormFragment form={this.props.form} initialValue={this.state.initialValue}/>
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
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
        const {
          snapshotsEnabled,
          triggerByVersion,
          maximumVersion,
          limitByVersion,
          minimumVersion,

          triggerByTime,
          maximumTime,
          limitByTime,
          minimumTime
        } = values;

        const policy = new ModelSnapshotPolicy(
          snapshotsEnabled,
          triggerByVersion,
          maximumVersion,
          limitByVersion,
          minimumVersion,

          triggerByTime,
          maximumTime,
          limitByTime,
          minimumTime
        );
        this.props.domainConfigService.setModelSnapshotPolicy(this.props.domainId, policy)
          .then(() => {
            notification.success({
              message: 'Settings Updated',
              description: `The domain model snapshot policy settings were successfully updated.`
            });
          }).catch((err) => {
          if (err instanceof RestError) {
            if (err.code === "duplicate") {
              notification.error({
                message: 'Settings Not Updated',
                description: `There was an error applying the settings.`
              });
            }
          }
        });
      }
    });
  }

  private _loadConfig = () => {
    const {promise, subscription} = makeCancelable(
      this.props.domainConfigService.getModelSnapshotPolicy(this.props.domainId));
    this._subscription = subscription;
    promise.then(initialValue => {
        this.setState({initialValue});
        this._subscription = null;
      }
    );
  }
}

const injections = [SERVICES.DOMAIN_CONFIG_SERVICE];
export const ModelSnapshotPolicySettings = injectAs<ModelSnapshotPolicySettingsProps>(injections, Form.create()(ModelSnapshotPolicySettingsComponent));
