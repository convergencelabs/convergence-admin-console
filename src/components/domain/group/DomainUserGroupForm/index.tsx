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
import {Button, Col, Form, Input, Row} from "antd";
import {DomainId} from "../../../../models/DomainId";
import {DomainUserList} from "../../user/DomainUserList/";
import {DomainUserGroup} from "../../../../models/domain/DomainUserGroup";
import {FormButtonBar} from "../../../common/FormButtonBar";

export interface DomainUserGroupFormProps {
  domainId: DomainId;
  initialValue: DomainUserGroup;
  saveButtonLabel: string;

  onCancel(): void;

  onSave(group: DomainUserGroup): void;
}

export interface DomainUserGroupFormState {
  members: string[];
}

export class DomainUserGroupForm extends React.Component<DomainUserGroupFormProps, DomainUserGroupFormState> {

  constructor(props: DomainUserGroupFormProps) {
    super(props);

    this.state = {
      members: this.props.initialValue.members.slice(0)
    };
  }

  public render(): ReactNode {
    return (
        <Form layout="vertical" onFinish={this._handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="id"
                         label="Id"
                         initialValue={this.props.initialValue.id}
                         rules={[{
                           required: true, whitespace: true, message: 'Please input a Id!',
                         }]}>
                <Input/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="description"
                         label="Description"
                         initialValue={this.props.initialValue.description}
                         rules={[{required: true, message: 'Please input a Description!', whitespace: true}]}
              >
                <Input.TextArea autoSize={{minRows: 2, maxRows: 6}}/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="Members">
                <DomainUserList
                    domainId={this.props.domainId}
                    users={this.state.members}
                    onChange={this._onMembersChanged}
                />
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

  private _onMembersChanged = (members: string[]) => {
    this.setState({members});
  }

  private _handleCancel = () => {
    this.props.onCancel();
  }

  private _handleSubmit = (values: any) => {
    const {id, description} = values;
    const group = new DomainUserGroup(id, description, this.state.members);
    this.props.onSave(group);
  }
}
