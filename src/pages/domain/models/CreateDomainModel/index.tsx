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
import {Page} from "../../../../components";
import {FileOutlined} from '@ant-design/icons';
import {Button, Card, Form, FormInstance, Input, notification, Select} from 'antd';
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {toDomainRoute} from "../../../../utils/domain-url";
import {CollectionAutoComplete} from "../../../../components/domain/collection/CollectionAutoComplete";
import AceEditor from "react-ace";
import {DomainModelService} from "../../../../services/domain/DomainModelService";
import {DomainId} from "../../../../models/DomainId";
import styles from "./styles.module.css";

export interface CreateDomainModelProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends CreateDomainModelProps {
  domainModelService: DomainModelService;
}

export interface CreateDomainModelState {

}

class CreateDomainModelComponent extends React.Component<InjectedProps, CreateDomainModelState> {
  private readonly _breadcrumbs = [
    {title: "Models", link: toDomainRoute(this.props.domainId, "models")},
    {title: "New Model"}
  ];
  private _formRef = React.createRef<FormInstance>();

  public render(): ReactNode {
    return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><FileOutlined/> New Model</span>} className={styles.formCard}>
            <Form ref={this._formRef} onFinish={this._handleSubmit}>
              <Form.Item name="collection"
                         label="Collection"
                         rules={[{
                           required: true, whitespace: true, message: 'Please select a Collection!'
                         }]}
              >
                <CollectionAutoComplete domainId={this.props.domainId}/>
              </Form.Item>
              <Form.Item name="idMode"
                         label="Model Id"
                         initialValue="auto"
                         rules={[{required: false, message: 'Please select a model id strategy!', whitespace: true}]}
              >
                <Select>
                  <Select.Option key="auto" value="auto">Auto Generated</Select.Option>
                  <Select.Option key="manual" value="manual">User Defined</Select.Option>
                </Select>
              </Form.Item>
              {
                this._formRef.current!.getFieldValue("idMode") === "manual" ?
                    <Form.Item name="id"
                               label="Id"
                               rules={[{required: true, message: 'Please input a model id!', whitespace: true}]}
                    >
                      <Input/>
                    </Form.Item> :
                    null
              }
              <Form.Item name="data"
                         label="Data"
                         initialValue="{\n\n}"
                         rules={[{required: true, validator: this._validateData}]}
              >
                <AceEditor
                    className={styles.data}
                    width={"100%"}
                    height="300px"
                    mode="json"
                    theme="solarized_dark"

                    name="create-model-data-editor"
                    fontSize={12}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    editorProps={{$blockScrolling: true}}
                />
              </Form.Item>
              <FormButtonBar>
                <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">Create</Button>
              </FormButtonBar>
            </Form>
          </Card>
        </Page>
    );
  }

  private _handleCancel = () => {
    const url = toDomainRoute(this.props.domainId, "models");
    this.props.history.push(url);
  }

  private _validateData = (rule: any, value: any, callback: any) => {
    try {
      JSON.parse(value);
      callback();
    } catch (e) {
      callback("JSON Data is Invalid: '" + e.message + "'");
    }
  }

  private _handleSubmit = () => {

    this._formRef.current!.validateFields().then(values => {
        const {collection, idMode, id, data} = values;

        try {
          const dataObj = JSON.parse(data);
          const domainId = this.props.domainId;

          const create: Promise<string> = idMode === "auto" ?
              this.props.domainModelService.createModel(domainId, collection, dataObj) :
              this.props.domainModelService.createOrUpdateModel(domainId, collection, id, dataObj);
          create.then((modelId) => {
            notification.success({
              message: 'Model Created',
              description: `Model '${modelId}' successfully created`
            });
            this.props.history.push(toDomainRoute(domainId, `models/${modelId}`));
          }).catch((err) => {
            if (err instanceof RestError) {
              if (err.code === "duplicate") {
                notification.error({
                  message: 'Could Not Create Model',
                  description: `A model with the specified ${err.details["field"]} already exists.`
                });
              }
            }
          });
        } catch (parseErr) {
          console.error(parseErr)
        }
    });
  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const CreateDomainModel = injectAs<CreateDomainModelProps>(injections, CreateDomainModelComponent);
