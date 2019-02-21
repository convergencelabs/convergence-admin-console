import React, {ReactNode} from 'react';
import {Button} from "antd";
import {DomainId} from "../../../../models/DomainId";
import {DomainUserId, DomainUserType} from "../../../../models/domain/DomainUserId";
import {ModelPermissions} from "../../../../models/domain/ModelPermissions";
import {ModelUserPermissions} from "../../../../models/domain/ModelUserPermissions";
import {ModelPermissionsControl} from "../ModelPermissionsControl";
import {DomainUsernameAutoComplete} from "../../user/DomainUsernameAutoComplete";
import styles from "./styles.module.css";

interface AddModelUserPermissionControlProps {
  domainId: DomainId;
  onAdd(userPermissions: ModelUserPermissions): Promise<boolean>;
}

interface AddModelUserPermissionControlState {
  username: string;
  permissions: ModelPermissions;
}

export class AddModelUserPermissionControl extends React.Component<AddModelUserPermissionControlProps, AddModelUserPermissionControlState> {
  private readonly _defaultPermissions: ModelPermissions;

  constructor(props: AddModelUserPermissionControlProps) {
    super(props);

    this._defaultPermissions = new ModelPermissions(false, false, false, false);

    this.state = {
      username: "",
      permissions: this._defaultPermissions
    }
  }

  public render(): ReactNode {
    const disabled = this.state.username === "";
    return (
      <div className={styles.addControl}>
        <DomainUsernameAutoComplete
          domainId={this.props.domainId}
          className={styles.username}
          value={this.state.username}
          onChange={this._onUsernameChanged}
          placeholder="Select User"
        />
        <ModelPermissionsControl
          value={this.state.permissions}
          onChange={this._onPermissionsChanged}
        />
        <Button
          htmlType="button"
          type="primary"
          onClick={this._onAdd}
          disabled={disabled}
        >Add</Button>
      </div>
    );
  }

  private _onUsernameChanged = (username: string) => {
    this.setState({username});
  }

  private _onPermissionsChanged = (permissions: ModelPermissions) => {
    this.setState({permissions});
  }

  private _onAdd = () => {
    this.props
      .onAdd(new ModelUserPermissions(new DomainUserId(DomainUserType.NORMAL, this.state.username), this.state.permissions))
      .then(() => {
        this.setState({
          username: "",
          permissions: this._defaultPermissions
        })
      });
  }
}
