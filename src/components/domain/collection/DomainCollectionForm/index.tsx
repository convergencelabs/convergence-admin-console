import React, {FormEvent, ReactNode} from "react";
import {Button, Checkbox, Col, Divider, Form, Input, Row} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {FormButtonBar} from "../../../common/FormButtonBar/";
import {ModelSnapshotPolicyFormFragment} from "../../common/ModelSnapshotPolicyFormFragment";
import {CollectionPermissions} from "../../../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../../../models/domain/ModelSnapshotPolicy";
import {Collection} from "../../../../models/domain/Collection";
import {FormCreateOption} from "antd/es/form";

interface DomainCollectionFormProps extends FormComponentProps {
  initialValue: Collection;
  disableId?: boolean;
  saveButtonLabel: string;

  onCancel(): void;

  onSave(collection: Collection): void;
}

class DomainCollectionFormComponent extends React.Component<DomainCollectionFormProps, {}> {
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
                <Input disabled={disableId}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="Description">
              {getFieldDecorator('description', {
                initialValue: initialValue.description,
                rules: [{required: false, message: 'Please input a Description!', whitespace: true}],
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
        <ModelSnapshotPolicyFormFragment initialValue={initialValue.snapshotPolicy} form={this.props.form} />
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

  private _handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

const formOptions: FormCreateOption<DomainCollectionFormProps> = { };
export const DomainCollectionForm = Form.create(formOptions)(DomainCollectionFormComponent);
