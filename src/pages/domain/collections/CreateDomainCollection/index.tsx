import * as React from 'react';
import {Page} from "../../../../components/Page/";
import {ReactNode} from "react";
import {Card, Col, InputNumber, notification, Row} from "antd";
import {Form, Input, Tooltip, Icon, Button, Select, Checkbox, Divider} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";
import {DomainCollectionService} from "../../../../services/domain/DomainCollectionService";
import {CollectionPermissions} from "../../../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../../../models/domain/ModelSnapshotPolicy";
import {Collection} from "../../../../models/domain/Collection";
import {toDomainUrl} from "../../../../utils/domain-url";

const {TextArea} = Input;

interface CreateDomainCollectionsProps extends RouteComponentProps {
  domain: DomainDescriptor;
}

interface InjectedProps extends CreateDomainCollectionsProps, FormComponentProps {
  domainCollectionService: DomainCollectionService;
}

class CreateDomainCollectionComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;

  constructor(props: InjectedProps) {
    super(props);

    this._breadcrumbs = new DomainBreadcrumbProducer([
      {title: "Collection", link: "/collections"},
      {title: "New Collection"}
    ]);
  }

  public render(): ReactNode {
    this._breadcrumbs.setDomain(this.props.domain);
    const {getFieldDecorator} = this.props.form;

    return (
      <Page breadcrumbs={this._breadcrumbs.breadcrumbs()}>
        <Card title={<span><Icon type="folder"/> New Collection</span>} className={styles.formCard}>
          <Form onSubmit={this._handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Id">
                  {getFieldDecorator('id', {
                    rules: [{
                      required: true, whitespace: true, message: 'Please input a Username!',
                    }],
                  })(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Description">
                  {getFieldDecorator('description', {
                    rules: [{required: true, message: 'Please input a Description!', whitespace: true}],
                  })(
                    <TextArea autosize={{minRows: 2, maxRows: 6}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider>World Permissions</Divider>
            <Row>
              <Col span={4}>
                {getFieldDecorator('readPermission', {initialValue: true, valuePropName: 'checked'})(
                  <Checkbox>Read</Checkbox>)}
              </Col>
              <Col span={4}>
                {getFieldDecorator('writePermission', {initialValue: true, valuePropName: 'checked'})(
                  <Checkbox>Write</Checkbox>)}
              </Col>
              <Col span={4}>
                {getFieldDecorator('createPermission', {initialValue: true, valuePropName: 'checked'})(
                  <Checkbox>Create</Checkbox>)}
              </Col>
              <Col span={4}>
                {getFieldDecorator('removePermission', {initialValue: true, valuePropName: 'checked'})(
                  <Checkbox>Remove</Checkbox>)}
              </Col>
              <Col span={4}>
                {getFieldDecorator('managePermission', {initialValue: false, valuePropName: 'checked'})(
                  <Checkbox>Manage</Checkbox>)}
              </Col>
            </Row>
            <Divider>Model Snapshot Policy</Divider>
            <Row>
              <Col span={24}>
                {getFieldDecorator('overrideSnapshotPolicy', {initialValue: false, valuePropName: 'checked'})(<Checkbox>Override
                  Domain Snapshot Policy</Checkbox>)}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                {getFieldDecorator('snapshotsEnabled', {initialValue: false, valuePropName: 'checked'})(<Checkbox>Snapshots
                  Enabled</Checkbox>)}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {getFieldDecorator('triggerByVersion', {initialValue: false, valuePropName: 'checked'})(<Checkbox>Trigger
                  By Version</Checkbox>)}
              </Col>
              <Col span={12}>
                {getFieldDecorator('limitByVersion', {initialValue: false, valuePropName: 'checked'})(<Checkbox>Limit By
                  Version</Checkbox>)}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Maximum Version">
                  {getFieldDecorator('maximumVersion', {initialValue: 0})(<InputNumber/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Minimum Version">
                  {getFieldDecorator('minimumVersion', {initialValue: 0})(<InputNumber/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {getFieldDecorator('triggerByTime', {initialValue: false, valuePropName: 'checked'})(<Checkbox>Trigger
                  By Time</Checkbox>)}
              </Col>
              <Col span={12}>
                {getFieldDecorator('limitByTime', {initialValue: false, valuePropName: 'checked'})(<Checkbox>Limit By
                  Time</Checkbox>)}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Maximum Time (min)">
                  {getFieldDecorator('maximumTime', {initialValue: 0})(<InputNumber/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Minimum Time (min)">
                  {getFieldDecorator('minimumTime', {initialValue: 0})(<InputNumber/>)}
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
    const url = toDomainUrl("", this.props.domain.toDomainId(), "collections");
    this.props.history.push(url);
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

        const domainId = this.props.domain.toDomainId();
        this.props.domainCollectionService.createCollection(domainId, collection)
          .then(() => {
            notification.success({
              message: 'Collection Created',
              description: `Collection '${id}' successfully created`
            });
            this.props.history.push(toDomainUrl("", domainId, "collections"));
          }).catch((err) => {
          if (err instanceof RestError) {
            if (err.code === "duplicate") {
              notification.error({
                message: 'Could Not Create Collection',
                description: `A collection with the specified ${err.details["field"]} already exists.`
              });
            }
          }
        });
      }
    });
  }
}

const injections = [SERVICES.DOMAIN_COLLECTION_SERVICE];
export const CreateDomainCollection = injectAs<CreateDomainCollectionsProps>(injections, Form.create<{}>()(CreateDomainCollectionComponent));
