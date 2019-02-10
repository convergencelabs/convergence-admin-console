import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import {Card, Col, notification, Row} from "antd";
import {Form, Input, Icon, Button, Select} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../components/FormButtonBar";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {RestError} from "../../../services/RestError";
import {NamespaceService} from "../../../services/NamespaceService";
import {Namespace} from "../../../models/Namespace";
import {UserRoleAdder} from "../../../components/UserRoleAdder";
import {UserRole, UserRoleTable} from "../../../components/UserRoleTable";


interface EditNamespaceProps extends RouteComponentProps {

}

interface InjectedProps extends EditNamespaceProps, FormComponentProps {
  namespaceService: NamespaceService;
}

interface EditNamespaceState {
  namespace: Namespace | null;
  userRoles: UserRole[];
}

class EditNamespaceComponent extends React.Component<InjectedProps, EditNamespaceState> {
  private readonly _breadcrumbs: BasicBreadcrumbsProducer;

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      namespace: null,
      userRoles: []
    };

    const namespaceId = (props.match.params as any).id;

    this._breadcrumbs = new BasicBreadcrumbsProducer([
      {title: "Namespaces", link: "/namespaces"},
      {title: namespaceId}
    ]);

    this.props.namespaceService.getNamespace(namespaceId).then(namespace => {
      this.setState({namespace});
    })
  }

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    const {namespace} = this.state;
    if (namespace === null) {
      return <div/>;
    } else {
      return (
        <Page breadcrumbs={this._breadcrumbs.breadcrumbs()}>
          <Card title={<span><Icon type="folder"/> Edit Namespace</span>} className={styles.formCard}>
            <Form onSubmit={this.handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Namespace Id">
                    {getFieldDecorator('id', {
                      initialValue: this.state.namespace!.id
                    })(
                      <Input disabled={true}/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Display Name">
                    {getFieldDecorator('displayName', {
                      rules: [{required: true, message: 'Please input a Display Name!', whitespace: true}],
                      initialValue: this.state.namespace!.displayName
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
                    <Button type="primary" htmlType="submit">Update</Button>
                  </FormButtonBar>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card className={styles.formCard}>
            <UserRoleAdder
              roles={["Developer", "Domain Admin", "Owner"]}
              defaultRole="Developer"
              selectWidth={200}
              onAdd={this._onAddUserRole}/>
            <UserRoleTable userRoles={this.state.userRoles}/>
          </Card>
        </Page>
      );
    }
  }


  private _onAddUserRole = (userRole: UserRole) => {
    const userRoles = [...this.state.userRoles, userRole];
    this.setState({userRoles})
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
            notification["success"]({
              message: 'Namespace Created',
              description: `Namespace '${id}' successfully created`,
              placement: "bottomRight"
            });
            this.props.history.push("./");
          }).catch((err) => {
          if (err instanceof RestError) {
            console.log(JSON.stringify(err));
            if (err.code === "duplicate") {
              notification["error"]({
                message: 'Could Not Create Namespace',
                description: `A user with the specified ${err.details["field"]} already exists.`,
                placement: "bottomRight"
              });
            }
          }
        });
      }
    });
  }
}

export const EditNamespace = injectAs<EditNamespaceProps>([SERVICES.NAMESPACE_SERVICE], Form.create<{}>()(EditNamespaceComponent));
