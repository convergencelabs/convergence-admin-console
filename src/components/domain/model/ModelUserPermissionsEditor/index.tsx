import React, {ReactNode} from 'react';
import {DomainId} from "../../../../models/DomainId";
import {ModelPermissions} from "../../../../models/domain/ModelPermissions";
import {ModelUserPermissions} from "../../../../models/domain/ModelUserPermissions";
import {ModelPermissionsControl} from "../ModelPermissionsControl";

interface ModelUserPermissionsEditorProps {
  domainId: DomainId;
  modelId: string;
  value: ModelUserPermissions;
  onChange(userPermissions: ModelUserPermissions): void
}

export class ModelUserPermissionsEditor extends React.Component<ModelUserPermissionsEditorProps, {}> {
  public render(): ReactNode {
    return (<ModelPermissionsControl value={this.props.value.permissions} onChange={this._onChange}/>);
  }

  private _onChange = (permissions: ModelPermissions) => {
    const userPermissions = this.props.value.copy({permissions});
    this.props.onChange(userPermissions);
  }
}
