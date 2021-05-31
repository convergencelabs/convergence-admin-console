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

import * as React from 'react';
import {ReactNode} from 'react';
import {Page} from "../../../../components";
import {FolderOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, FormInstance, Input, notification, Row, Tooltip} from "antd";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {NamespaceService} from "../../../../services/NamespaceService";

interface InjectedProps extends RouteComponentProps {
  namespaceService: NamespaceService;
}

class CreateNamespaceComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Namespaces", link: "/namespaces"},
    {title: "New Namespace"}
  ];

  private _formRef = React.createRef<FormInstance>();

  public render(): ReactNode {
    return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><FolderOutlined/> New Namespace</span>} className={styles.formCard}>
            <Form ref={this._formRef} onFinish={this.handleSubmit}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="id"
                             label="Namespace Id"
                             rules={[{
                               required: true, whitespace: true, message: 'Please input a namespace id!'
                             }]}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="displayName"
                             label={(
                                 <span>Display Name&nbsp;
                                   <Tooltip title="A display friendly name for the namespace?">
                                    <QuestionCircleOutlined/>
                                  </Tooltip>
                                 </span>
                             )}
                             rules={[{required: true, message: 'Please input a Display Name!', whitespace: true}]}
                  >
                    <Input/>
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

  private handleSubmit = () => {
    this._formRef.current!.validateFields().then(values => {
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
    });
  }
}

export const CreateNamespace =
    injectAs<RouteComponentProps>([SERVICES.NAMESPACE_SERVICE], CreateNamespaceComponent);