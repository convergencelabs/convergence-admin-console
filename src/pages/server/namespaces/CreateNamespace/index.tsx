import * as React from 'react';
import {Page} from "../../../../components/common/Page/";
import {ReactNode} from "react";
import {Card, Col, notification, Row} from "antd";
import {Form, Input, Tooltip, Icon, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {NamespaceService} from "../../../../services/NamespaceService";

interface InjectedProps extends RouteComponentProps, FormComponentProps {
  namespaceService: NamespaceService;
}

class CreateNamespaceComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Namespaces", link: "/namespaces"},
    {title: "New Namespace"}
  ];

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="folder"/> New Namespace</span>} className={styles.formCard}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Namespace Id">
                  {getFieldDecorator('id', {
                    rules: [{
                      required: true, whitespace: true, message: 'Please input a namespace id!',
                    }],
                  })(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={(
                  <span>Display Name&nbsp;
                    <Tooltip title="A display friendly name for the namespace?">
                  <Icon type="question-circle-o"/>
                </Tooltip>
                </span>
                )}>
                  {getFieldDecorator('displayName', {
                    rules: [{required: true, message: 'Please input a Display Name!', whitespace: true}],
                  })(
                    <Input/>
                  )}
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
    this.props.history.push("/namespaces/");
  }

  private handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
        const {id, displayName} = values;
        this.props.namespaceService.createNamespace(id, displayName)
          .then(() => {
            notification.success({
              message: 'Namespace Created',
              description: `Namespace '${id}' successfully created`,
              placement: "bottomRight",
              duration: 3
            });
            this.props.history.push("/namespaces");
          }).catch((err) => {
          if (err instanceof RestError) {
            console.log(JSON.stringify(err));
            if (err.code === "duplicate") {
              notification["error"]({
                message: 'Could Not Create Namespace',
                description: `A namespace with the specified ${err.details["field"]} already exists.`,
                placement: "bottomRight"
              });
            }
          }
        });
      }
    });
  }
}

export const CreateNamespace = injectAs<RouteComponentProps>([SERVICES.NAMESPACE_SERVICE], Form.create<{}>()(CreateNamespaceComponent));
