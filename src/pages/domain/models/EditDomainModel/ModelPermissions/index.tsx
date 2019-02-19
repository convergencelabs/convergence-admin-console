import React, {ReactFragment, ReactNode} from 'react';
import {injectAs} from "../../../../../utils/mobx-utils";
import {SERVICES} from "../../../../../services/ServiceConstants";
import {DomainModelService} from "../../../../../services/domain/DomainModelService";
import {SapphireEditor} from "../../../../../components/ModelEditor/index";
import {STORES} from "../../../../../stores/StoreConstants";
import {ConvergenceDomainStore} from "../../../../../stores/ConvergenceDomainStore";
import {RealTimeModel} from "@convergence/convergence";
import {Button, Card, Dropdown, Icon, Input, List, Menu, Popover, Table} from "antd";
import styles from "./styles.module.css";
import {filter} from "rxjs/operators";
import {longDateTime} from "../../../../../utils/format-utils";
import Checkbox from "antd/es/checkbox/Checkbox";
import {ColumnProps} from "antd/lib/table";

interface ModelPermissionsProps {
  modelId: string;
}

interface InjectedProps extends ModelPermissionsProps {
  domainModelService: DomainModelService;
}

export interface ModelPermissionsState {
}

const dataSource = [{
  username: 'michael',
  permissions: {read: true, write: true, remove: false, manage: false},
}, {
  username: 'tim',
  permissions: {read: true, write: true, remove: true, manage: true},
}];

const columns: ColumnProps<any>[] = [{
  title: 'Username',
  dataIndex: 'username',
  align: "left",
  sorter: (a: any, b: any) => a.username.toLocaleLowerCase().localeCompare(b.username.toLocaleLowerCase())
}, {
  title: 'Permissions',
  dataIndex: 'permissions',
  align: "center",
  width: 400,
  render: renderPermissions
}, {
  title: '',
  dataIndex: '',
  align: "right",
  width: 50,
  render: () => (<Button shape="circle" size="small" icon="delete"/>)
}];

function renderPermissions(val: { read: boolean, write: boolean, remove: boolean, manage: boolean }) {
  return (
    <React.Fragment>
      <Checkbox checked={val.read}>Read</Checkbox>
      <Checkbox checked={val.write}>Write</Checkbox>
      <Checkbox checked={val.remove}>Remove</Checkbox>
      <Checkbox checked={val.manage}>Manage</Checkbox>
    </React.Fragment>
  )
}

class ModelEditorTabComponent extends React.Component<InjectedProps, ModelPermissionsState> {
  constructor(props: InjectedProps) {
    super(props);

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
                     columns={columns}
                     pagination={false}
                     size="middle"/>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE];
export const ModelPermissions = injectAs<ModelPermissionsState>(injections, ModelEditorTabComponent);
