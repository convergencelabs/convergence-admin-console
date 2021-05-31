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
import {Button, Checkbox, Col, Form, Input, Row} from "antd";
import {UserApiKey} from "../../../models/UserApiKey";
import {FormButtonBar} from "../../common/FormButtonBar";

interface DomainCollectionFormProps {
  initialValue: UserApiKey;
  saveButtonLabel: string;

  onCancel(): void;

  onSave(data: { name: string, enabled: boolean }): void;
}

export class ApiKeyForm extends React.Component<DomainCollectionFormProps, {}> {

  public render(): ReactNode {
    const {initialValue} = this.props;
    return (
        <Form layout="vertical" onFinish={this._handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="name"
                         label="Name"
                         initialValue={initialValue.name}
                         rules={[{
                           required: true, whitespace: true, message: 'Please input an API Key name!',
                         }]}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="enabled"
                         initialValue={initialValue.enabled}
                         valuePropName="checked"
              >
                <Checkbox>Enabled</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormButtonBar>
                <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">{this.props.saveButtonLabel}</Button>
              </FormButtonBar>
            </Col>
          </Row>
        </Form>
    );
  }

  private _handleCancel = () => {
    this.props.onCancel();
  }

  private _handleSubmit = (values: any) => {
    const {name, enabled} = values;
    this.props.onSave({name, enabled});
  }
}
