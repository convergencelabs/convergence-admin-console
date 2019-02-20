import React, {ReactNode, FormEvent} from "react";
import {
  Col,
  InputNumber,
  Row,
  Form,
  Input,
  Button,
  Checkbox,
  Divider
} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {FormButtonBar} from "../../../FormButtonBar/";
import {CollectionPermissions} from "../../../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../../../models/domain/ModelSnapshotPolicy";
import {Collection} from "../../../../models/domain/Collection";

interface DomainCollectionFormProps {
  initialValue: Collection;
  disableId?: boolean;
  saveButtonLabel: string;

  onCancel(): void;

  onSave(collection: Collection): void;
}

class DomainCollectionFormComponent extends React.Component<DomainCollectionFormProps & FormComponentProps, {}> {
  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;

    const {initialValue, disableId} = this.props;

    return (
      <Form onSubmit={this._handleSubmit}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Id">
              {getFieldDecorator('id', {
                initialValue: initialValue.id,
                rules: [{
                  required: !this.props.disableId, whitespace: true, message: 'Please input an Id!',
                }],
              })(
                <Input disabled={this.props.disableId}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="Description">
              {getFieldDecorator('description', {
                initialValue: initialValue.description,
                rules: [{required: true, message: 'Please input a Description!', whitespace: true}],
              })(
                <Input.TextArea autosize={{minRows: 2, maxRows: 6}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Divider>World Permissions</Divider>
        <Row>
          <Col span={4}>
            {getFieldDecorator('readPermission', {
              initialValue: initialValue.worldPermissions.read,
              valuePropName: 'checked'
            })(
              <Checkbox>Read</Checkbox>)}
          </Col>
          <Col span={4}>
            {getFieldDecorator('writePermission', {
              initialValue: initialValue.worldPermissions.write,
              valuePropName: 'checked'
            })(
              <Checkbox>Write</Checkbox>)}
          </Col>
          <Col span={4}>
            {getFieldDecorator('createPermission', {
              initialValue: initialValue.worldPermissions.create,
              valuePropName: 'checked'
            })(
              <Checkbox>Create</Checkbox>)}
          </Col>
          <Col span={4}>
            {getFieldDecorator('removePermission', {
              initialValue: initialValue.worldPermissions.remove,
              valuePropName: 'checked'
            })(
              <Checkbox>Remove</Checkbox>
            )}
          </Col>
          <Col span={4}>
            {getFieldDecorator('managePermission', {
              initialValue: initialValue.worldPermissions.manage,
              valuePropName: 'checked'
            })(
              <Checkbox>Manage</Checkbox>
            )}
          </Col>
        </Row>
        <Divider>Model Snapshot Policy</Divider>
        <Row>
          <Col span={24}>
            {getFieldDecorator('overrideSnapshotPolicy', {
              initialValue: initialValue.overrideSnapshotPolicy, valuePropName: 'checked'
            })(
              <Checkbox>Override Domain Snapshot Policy</Checkbox>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {getFieldDecorator('snapshotsEnabled', {
              initialValue: initialValue.snapshotPolicy.snapshotsEnabled,
              valuePropName: 'checked'
            })(
              <Checkbox>Snapshots Enabled</Checkbox>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {getFieldDecorator('triggerByVersion', {
              initialValue: initialValue.snapshotPolicy.triggerByVersion,
              valuePropName: 'checked'
            })(
              <Checkbox>Trigger By Version</Checkbox>
            )}
          </Col>
          <Col span={12}>
            {getFieldDecorator('limitByVersion', {
              initialValue: initialValue.snapshotPolicy.limitByVersion,
              valuePropName: 'checked'
            })(
              <Checkbox>Limit By Version</Checkbox>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="Maximum Version">
              {getFieldDecorator('maximumVersion', {
                initialValue: initialValue.snapshotPolicy.maximumVersionInterval
              })(
                <InputNumber/>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Minimum Version">
              {getFieldDecorator('minimumVersion', {
                initialValue: initialValue.snapshotPolicy.minimumVersionInterval
              })(
                <InputNumber/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {getFieldDecorator('triggerByTime', {
              initialValue: initialValue.snapshotPolicy.triggerByTime, valuePropName: 'checked'
            })(
              <Checkbox>Trigger By Time</Checkbox>
            )}
          </Col>
          <Col span={12}>
            {getFieldDecorator('limitByTime', {
              initialValue: initialValue.snapshotPolicy.limitByTime,
              valuePropName: 'checked'
            })(
              <Checkbox>Limit By Time</Checkbox>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="Maximum Time (min)">
              {getFieldDecorator('maximumTime', {
                initialValue: initialValue.snapshotPolicy.maximumTimeInterval
              })(
                <InputNumber/>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Minimum Time (min)">
              {getFieldDecorator('minimumTime', {
                initialValue: initialValue.snapshotPolicy.minimumTimeInterval
              })(<InputNumber/>)}
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

  private _handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
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

        const permissions = new CollectionPermissions(
          readPermission, writePermission, createPermission, removePermission, managePermission);

        const snapshotPolicy = new ModelSnapshotPolicy(snapshotsEnabled,
          triggerByVersion, maximumVersion, limitByVersion, minimumVersion,
          triggerByTime, maximumTime, limitByTime, minimumTime);

        const collection = new Collection(id, description, permissions, overrideSnapshotPolicy, snapshotPolicy);
        this.props.onSave(collection);
      }
    });
  }
}

export const DomainCollectionForm = Form.create<{}>()(DomainCollectionFormComponent)
