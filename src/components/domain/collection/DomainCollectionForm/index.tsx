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
import {Button, Checkbox, Col, Divider, Form, Input, Row, Tabs} from "antd";
import {FormButtonBar} from "../../../common/FormButtonBar/";
import {ModelSnapshotPolicyFormFragment} from "../../common/ModelSnapshotPolicyFormFragment";
import {CollectionPermissions} from "../../../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../../../models/domain/ModelSnapshotPolicy";
import {Collection} from "../../../../models/domain/Collection";
import {CollectionPermissionsTab} from "../CollectionUserPermissionsTab";
import {DomainId} from "../../../../models/DomainId";
import {CollectionUserPermissions} from "../../../../models/domain/CollectionUserPermissions";
import {DescriptionBox} from "../../../common/DescriptionBox";
import styles from "./styles.module.css";

export interface DomainCollectionFormProps {
  domainId: DomainId;
  initialValue: Collection;
  disableId?: boolean;
  saveButtonLabel: string;

  onCancel(): void;

  onSave(collection: Collection): void;
}

export interface DomainCollectionFormState {
  userPermissions: CollectionUserPermissions[];
}

export class DomainCollectionForm extends React.Component<DomainCollectionFormProps, DomainCollectionFormState> {

  constructor(props: DomainCollectionFormProps) {
    super(props);

    this.state = {
      userPermissions: this.props.initialValue.userPermissions.slice(0)
    }
  }

  public render(): ReactNode {
    const {initialValue, disableId} = this.props;

    return (
        <Form layout="vertical"
              onFinish={this._handleSubmit}>
          <Row>
            <Col span={24}>
              <Form.Item name="id"
                         label="Id"
                         initialValue={initialValue.id}
                         rules={[{
                           required: !this.props.disableId, whitespace: true, message: 'Please input an Id!',
                         }]}
              >
                <Input disabled={disableId}/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="description"
                         label="Description"
                         initialValue={initialValue.description}
                         rules={[{required: false, message: 'Please input a Description!', whitespace: true}]}
              >
                <Input.TextArea autoSize={{minRows: 2, maxRows: 6}}/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Tabs>
              <Tabs.TabPane tab="World Permissions" key="world_permissions">
                <div className={styles.description}>
                  <DescriptionBox>
                    These permissions apply to all users and all models in this
                    collection unless the user has specific permissions on this
                    collection, or on a particular model within the collection.
                  </DescriptionBox>
                </div>
                <Row>
                  <Col span={4}>
                    <Form.Item name="readPermission"
                               initialValue={initialValue.worldPermissions.read}
                               valuePropName="checked"
                    >
                      <Checkbox>Read</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="writePermission"
                               initialValue={initialValue.worldPermissions.write}
                               valuePropName="checked"
                    >
                      <Checkbox>Write</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="createPermission"
                               initialValue={initialValue.worldPermissions.create}
                               valuePropName="checked"
                    >
                      <Checkbox>Create</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="removePermission"
                               initialValue={initialValue.worldPermissions.remove}
                               valuePropName="checked"
                    >
                      <Checkbox>Remove</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="managePermission"
                               initialValue={initialValue.worldPermissions.manage}
                               valuePropName="checked"
                    >
                      <Checkbox>Manage</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="User Permissions" key="user_permissions">
                <div className={styles.description}>
                  <DescriptionBox>
                    These permissions apply to specific users accessing all models in the
                    collection unless the user has specific permissions on a particular model.
                  </DescriptionBox>
                </div>
                <CollectionPermissionsTab
                    domainId={this.props.domainId}
                    permissions={this.state.userPermissions}
                    onUserPermissionsChanged={this._onUserPermissionsChanged}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Model Snapshot Policy" key="snapshot_policy">
                <Row className={styles.description}>
                  <DescriptionBox>The collection may override the domain level model snapshot policy.</DescriptionBox>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name="overrideSnapshotPolicy"
                               initialValue={initialValue.overrideSnapshotPolicy}
                               valuePropName="checked"
                    >
                      <Checkbox>Override Domain Snapshot Policy</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <ModelSnapshotPolicyFormFragment initialValue={initialValue.snapshotPolicy}/>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </Row>
          <Divider/>
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
    const {
      id,
      description,

      readPermission,
      createPermission,
      writePermission,
      removePermission,
      managePermission,

      overrideSnapshotPolicy,

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

    const worldPermissions = new CollectionPermissions(
        readPermission, writePermission, createPermission, removePermission, managePermission);

    const userPermissions = this.state.userPermissions.slice(0);

    // We have to or the values here in case the tab was never show, these will be
    // all undefined, however in that case it means they were not edited and
    // we can use what was passed in.
    const snapshotPolicy = new ModelSnapshotPolicy(
        snapshotsEnabled || this.props.initialValue.snapshotPolicy.snapshotsEnabled,
        triggerByVersion || this.props.initialValue.snapshotPolicy.triggerByVersion,
        maximumVersion || this.props.initialValue.snapshotPolicy.maximumVersionInterval,
        limitByVersion || this.props.initialValue.snapshotPolicy.limitByVersion,
        minimumVersion || this.props.initialValue.snapshotPolicy.minimumVersionInterval,
        triggerByTime || this.props.initialValue.snapshotPolicy.triggerByTime,
        maximumTime || this.props.initialValue.snapshotPolicy.maximumTimeInterval,
        limitByTime || this.props.initialValue.snapshotPolicy.limitByTime,
        minimumTime || this.props.initialValue.snapshotPolicy.minimumTimeInterval);

    const collection = new Collection(
        id, description, worldPermissions, userPermissions, overrideSnapshotPolicy, snapshotPolicy);

    this.props.onSave(collection);
  }

  private _onUserPermissionsChanged = (p: CollectionUserPermissions[]) => {
    this.setState({userPermissions: p});
  }
}
