import React, {ReactNode} from 'react';
import {DomainModelService} from "../../../../../services/domain/DomainModelService";
import Checkbox from "antd/es/checkbox/Checkbox";
import {DomainId} from "../../../../../models/DomainId";
import {ModelPermissions} from "../../../../../models/domain/ModelPermissions";
import {CheckboxChangeEvent} from "antd/lib/checkbox";
import {ModelUserPermissions} from "../../../../../models/domain/ModelUserPermissions";
import {notification} from "antd";


interface ModelUserPermissionsEditorProps {
  domainId: DomainId
  modelId: string;
  username: string;
  domainModelService: DomainModelService;
  initialValue: ModelPermissions;
}

export interface ModelUserPermissionsEditorState {
  read: boolean;
  write: boolean;
  remove: boolean;
  manage: boolean;
}


export class ModelUserPermissionsEditor extends React.Component<ModelUserPermissionsEditorProps, ModelUserPermissionsEditorState> {
  constructor(props: ModelUserPermissionsEditorProps) {
    super(props);

    this.state = {
      read: this.props.initialValue.read,
      write: this.props.initialValue.write,
      remove: this.props.initialValue.remove,
      manage: this.props.initialValue.manage
    };
  }

  public render(): ReactNode {
    return (
      <React.Fragment>
        <Checkbox checked={this.state.read} onChange={this._readChange}>Read</Checkbox>
        <Checkbox checked={this.state.write} onChange={this._writeChange}>Write</Checkbox>
        <Checkbox checked={this.state.remove} onChange={this._removeChange}>Remove</Checkbox>
        <Checkbox checked={this.state.manage} onChange={this._manageChange}>Manage</Checkbox>
      </React.Fragment>
    );
  }

  private _readChange = (e: CheckboxChangeEvent) => {
    const read = e.target.checked;
    const {write, remove, manage} = this.state;
    this.setState({read});
    this._updatePermissions(read, write, remove, manage);
  }

  private _writeChange = (e: CheckboxChangeEvent) => {
    const write = e.target.checked;
    const {read, remove, manage} = this.state;

    this.setState({write});
    this._updatePermissions(read, write, remove, manage);
  }

  private _removeChange = (e: CheckboxChangeEvent) => {
    const remove = e.target.checked;
    const {read, write, manage} = this.state;
    this.setState({remove});
    this._updatePermissions(read, write, remove, manage);
  }

  private _manageChange = (e: CheckboxChangeEvent) => {
    const manage = e.target.checked;
    const {read, write, remove} = this.state;
    this.setState({manage});
    this._updatePermissions(read, write, remove, manage);
  }

  private _updatePermissions(read: boolean, write: boolean, remove: boolean, manage: boolean): void {
    // this.props.domainModelService
    //   .setModelUserPermissions(
    //     this.props.domainId,
    //     this.props.modelId,
    //     new ModelUserPermissions(
    //       this.props.username,
    //       new ModelPermissions(read, write, remove, manage)
    //     )
    //   )
    //   .catch(err => {
    //     notification.error({
    //       message: "Permissions Update Failed",
    //       description: "Could not set permissions for user."
    //     });
    //   });
  }
}
