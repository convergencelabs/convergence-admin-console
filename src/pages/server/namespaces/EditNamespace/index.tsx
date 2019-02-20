import * as React from 'react';
import {Page} from "../../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../../stores/BreacrumStore";
import {Card, Col, notification, Row} from "antd";
import {Form, Input, Icon, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {NamespaceService} from "../../../../services/NamespaceService";
import {Namespace} from "../../../../models/Namespace";
import {UserRoleAdder} from "../../../../components/UserRoleAdder/";
import {UserRoleTable} from "../../../../components/UserRoleTable/";
import {RoleService, RoleTarget} from "../../../../services/RoleService";


interface EditNamespaceProps extends RouteComponentProps {

}

interface InjectedProps extends EditNamespaceProps, FormComponentProps {
  namespaceService: NamespaceService;
  roleService: RoleService;
}

interface EditNamespaceState {
  namespace: Namespace | null;
  userRoles: Map<string, string>;
}

class EditNamespaceComponent extends React.Component<InjectedProps, EditNamespaceState> {
  private readonly _breadcrumbs: BasicBreadcrumbsProducer;

  private readonly _roles = ["Developer", "Domain Admin", "Owner"];

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      namespace: null,
      userRoles: new Map()
    };

    const namespaceId = (props.match.params as any).id;

    this._breadcrumbs = new BasicBreadcrumbsProducer([
      {title: "Namespaces", link: "/namespaces"},
      {title: namespaceId}
    ]);

    this.props.namespaceService.getNamespace(namespaceId).then(namespace => {
      this.setState({namespace});
      this._loadUserRoles();
    });
  }

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    const {namespace} = this.state;
    if (namespace === null) {
      return <div/>;
    } else {
      return (
        <Page breadcrumbs={this._breadcrumbs}>
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
              roles={this._roles}
              defaultRole="Developer"
              selectWidth={200}
              onAdd={this._setUserRole}/>
            <UserRoleTable
              roles={this._roles}
              userRoles={this.state.userRoles}
              onRemoveUser={this._onRemoveUserRole}
              onChangeRole={this._setUserRole}
            />
          </Card>
        </Page>
      );
    }
  }

  private _loadUserRoles(): void {
    this.props.roleService
      .getUserRoles(RoleTarget.namespace(this.state.namespace!.id))
      .then(userRoles => {
        this.setState({userRoles});
      });
  }

  private _onRemoveUserRole = (username: string) => {
    this.props.roleService
      .deleteUserRoles(RoleTarget.namespace(this.state.namespace!.id), username)
      .then(() => {
        const userRoles = new Map(this.state.userRoles);
        userRoles.delete(username);
        this.setState({userRoles});
        this._loadUserRoles();
      })
      .catch(err => {
        console.error(err);
        notification.error({
          message: 'Could Not Delete namespaces Role',
          description: `Could not delete role for the user.`,
        });
      });
  }

  private _setUserRole = (username: string, role: string) => {
    this.props.roleService
      .setUserRole(RoleTarget.namespace(this.state.namespace!.id), username, role)
      .then(() => {
        const userRoles = new Map(this.state.userRoles);
        userRoles.set(username, role);
        this.setState({userRoles});
        this._loadUserRoles();
      })
      .catch(err => {
        console.error(err);
        notification.error({
          message: 'Could Not Set namespaces Role',
          description: `Could not set role for the user.`,
        });
      });

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
            });
            this.props.history.push("./");
          })
          .catch((err) => {
            if (err instanceof RestError) {
              if (err.code === "duplicate") {
                notification.error({
                  message: 'Could Not Update Namespace',
                  description: `A namespace with the specified ${err.details["field"]} already exists.`,
                });
              }
            }
          });
      }
    });
  }
}

export const EditNamespace = injectAs<EditNamespaceProps>([SERVICES.NAMESPACE_SERVICE, SERVICES.ROLE_SERVICE], Form.create<{}>()(EditNamespaceComponent));
