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

import React, {ReactNode} from "react";
import {Checkbox, Col, Form, InputNumber, Row} from "antd";
import {ModelSnapshotPolicy} from "../../../../models/domain/ModelSnapshotPolicy";

interface ModelSnapshotPolicyFormFragmentProps {
  initialValue: ModelSnapshotPolicy;
}

export class ModelSnapshotPolicyFormFragment extends React.Component<ModelSnapshotPolicyFormFragmentProps, {}> {
  public render(): ReactNode {
    return (
        <React.Fragment>
          <Row>
            <Col span={24}>
              <Form.Item name="snapshotsEnabled"
                         initialValue={this.props.initialValue.snapshotsEnabled}
                         valuePropName='checked'
              >
                <Checkbox>Snapshots Enabled</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="triggerByVersion"
                         initialValue={this.props.initialValue.triggerByVersion}
                         valuePropName='checked'
              >
                <Checkbox>Trigger By Version</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="limitByVersion"
                         initialValue={this.props.initialValue.limitByVersion}
                         valuePropName='checked'
              >
                <Checkbox>Limit By Version</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="maximumVersion"
                         label="Maximum Version"
                         initialValue={this.props.initialValue.maximumVersionInterval}>
                <InputNumber/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minimumVersion"
                         label="Minimum Version"
                         initialValue={this.props.initialValue.minimumVersionInterval}>
                <InputNumber/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="triggerByTime"
                         initialValue={this.props.initialValue.triggerByTime}
                         valuePropName='checked'
              >
                <Checkbox>Trigger By Time</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="limitByTime"
                         initialValue={this.props.initialValue.limitByTime}
                         valuePropName='checked'
              >
                <Checkbox>Limit By Time</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="maximumTime"
                         label="Maximum Time (min)"
                         initialValue={this.props.initialValue.maximumTimeInterval}>
                <InputNumber/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minimumTime"
                         label="Minimum Time (min)"
                         initialValue={this.props.initialValue.minimumTimeInterval}
              >
                <InputNumber/>
              </Form.Item>
            </Col>
          </Row>
        </React.Fragment>
    );
  }
}
