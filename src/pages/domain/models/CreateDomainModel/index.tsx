import React, {ReactNode} from "react";
import {Page} from "../../../../components/common/Page/";
import {Form, Input, Icon, Button, Select, Card, notification} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {toDomainUrl} from "../../../../utils/domain-url";
import {CollectionAutoComplete} from "../../../../components/domain/collection/CollectionAutoComplete";
import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/solarized_dark';
import AceEditor from "react-ace";
import {DomainModelService} from "../../../../services/domain/DomainModelService";
import {DomainId} from "../../../../models/DomainId";

export interface CreateDomainModelProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends CreateDomainModelProps, FormComponentProps {
  domainModelService: DomainModelService;
}

export interface CreateDomainModelState {
  data: string;
}

class CreateDomainModelComponent extends React.Component<InjectedProps, CreateDomainModelState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;

  constructor(props: InjectedProps) {
    super(props);

    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [
      {title: "Models", link: "/models"},
      {title: "New Model"}
    ]);

    this.state = {
      data: "{\n\n}"
    }
  }

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;

    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="file"/> New Model</span>} className={styles.formCard}>
          <Form onSubmit={this._handleSubmit}>
            <Form.Item label="Collection">
              {getFieldDecorator('collection', {
                rules: [{
                  required: true, whitespace: true, message: 'Please select a Collection!',
                }],
              })(
                <CollectionAutoComplete domainId={this.props.domainId}/>
              )}
            </Form.Item>
            <Form.Item label="Model Id">
              {getFieldDecorator('idMode', {
                initialValue: "auto",
                rules: [{required: false, message: 'Please input a Display Name!', whitespace: true}],
              })(
                <Select>
                  <Select.Option key="auto">Auto Generated</Select.Option>
                  <Select.Option key="manual">User Defined</Select.Option>
                </Select>
              )}
            </Form.Item>
            {
              this.props.form.getFieldValue("idMode") === "manual" ?
                <Form.Item label="Id">
                  {getFieldDecorator('id', {
                    rules: [{required: false, message: 'Please input a Display Name!', whitespace: true}],
                  })(
                    <Input/>
                  )}
                </Form.Item> :
                null
            }
            <Form.Item label="Data">
              <AceEditor
                className={styles.data}
                width={"100%"}
                height="300px"
                mode="json"
                theme="solarized_dark"
                value={this.state.data}
                onChange={this._onDataChange}
                name="create-model-data-editor"
                fontSize={12}
                defaultValue={`{\n\n}`}
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

  private _onDataChange = (newValue: string) => {
    this.setState({data: newValue});
  }

  private _handleCancel = () => {
    const url = toDomainUrl("", this.props.domainId, "models");
    this.props.history.push(url);
  }

  private _handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
        const {collection, idMode, id} = values;
        const {data} = this.state;

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
            this.props.history.push(toDomainUrl("", domainId, `models/${modelId}`));
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
        catch (parseErr) {
          console.error(parseErr)
        }
      }
    });
  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const CreateDomainModel = injectAs<CreateDomainModelProps>(injections, Form.create<{}>()(CreateDomainModelComponent));
