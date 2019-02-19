import React, {ReactNode} from 'react';
import {injectAs} from "../../../../../utils/mobx-utils";
import {SERVICES} from "../../../../../services/ServiceConstants";
import {DomainModelService} from "../../../../../services/domain/DomainModelService";
import {Button, Card, Input, Table} from "antd";
import styles from "./styles.module.css";
import Checkbox from "antd/es/checkbox/Checkbox";
import {ColumnProps} from "antd/lib/table";
import {ModelPermissions} from "../../../../../models/domain/ModelPermissions";
import {ModelUserPermissionsEditor} from "../ModelUserPermissionsEditor"
import {DomainId} from "../../../../../models/DomainId";
import {Model} from "../../../../../models/domain/Model";

interface ModelPermissionsProps {
  domainId: DomainId;
  modelId: string;
}

interface InjectedProps extends ModelPermissionsProps {
  domainModelService: DomainModelService;
}

const dataSource = [{
  username: 'michael',
  permissions: new ModelPermissions(true, true, false, false),
}, {
  username: 'tim',
  permissions: new ModelPermissions(true, true, true, true),
}];

export interface ModelPermissionsState {
}

class ModelPermissionsTabComponent extends React.Component<InjectedProps, ModelPermissionsState> {
  private readonly _columns: ColumnProps<any>[];
  constructor(props: InjectedProps) {
    super(props);




    this._columns = [{
      title: 'Username',
      dataIndex: 'username',
      align: "left",
      sorter: (a: any, b: any) => a.username.toLocaleLowerCase().localeCompare(b.username.toLocaleLowerCase())
    }, {
      title: 'Permissions',
      dataIndex: 'permissions',
      align: "center",
      width: 400,
      render: this._renderPermissions
    }, {
      title: '',
      dataIndex: '',
      align: "right",
      width: 50,
      render: () => (<Button shape="circle" size="small" icon="delete"/>)
    }];

    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div>
        <Card title="World Permissions" type="inner">
          <div className={styles.description}>These permissions apply to anyone accessing the collection, unless
            specifically overridden.
          </div>
          <div className={styles.row}>
            <Checkbox>Override Collection Permissions</Checkbox>
          </div>
          <div className={styles.row}>
            <Checkbox>Read</Checkbox>
            <Checkbox>Write</Checkbox>
            <Checkbox>Delete</Checkbox>
            <Checkbox>Manage</Checkbox>
          </div>
        </Card>
        <Card title="User Permissions" type="inner" className={styles.userPermissions}>
          <div className={styles.userPermissionsContainer}>
            <div className={styles.description}>These permissions apply to specific users accessing the model.</div>
            <div className={styles.row}>
              <div className={styles.addControl}>
              <Input placeholder="Enter Username" style={{width: 300, marginRight: 15}}/>
              <Checkbox>Read</Checkbox>
              <Checkbox>Write</Checkbox>
              <Checkbox>Delete</Checkbox>
              <Checkbox>Manage</Checkbox>
              <Button htmlType="button" type="primary">Add</Button>
              </div>
            </div>
            <div>
              <Table dataSource={dataSource}
                     columns={this._columns}
                     rowKey="username"
                     pagination={false}
                     size="middle"/>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  private _renderPermissions = (permissions: ModelPermissions, record: any) =>{
    return (
      <ModelUserPermissionsEditor
        domainId={this.props.domainId}
        modelId={this.props.modelId}
        username={record.username}
        initialValue={permissions}
        domainModelService={this.props.domainModelService}
      />
    )
  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const ModelPermissionsTab = injectAs<ModelPermissionsState>(injections, ModelPermissionsTabComponent);
