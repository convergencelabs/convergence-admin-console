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
  username: string | null;
  permissions: ModelPermissions;
}

export class AddModelUserPermissionControl extends React.Component<AddModelUserPermissionControlProps, AddModelUserPermissionControlState> {
  private readonly _defaultPermissions: ModelPermissions;

  constructor(props: AddModelUserPermissionControlProps) {
    super(props);

    this._defaultPermissions = new ModelPermissions(false, false, false, false);

    this.state = {
      username: null,
      permissions: this._defaultPermissions
    }
  }

  public render(): ReactNode {
    const disabled = this.state.username === "" || this.state.username === undefined;
    return (
      <div className={styles.container}>
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
          className={styles.addButton}
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
    if (!this.state.username || this.state.username === "") {
      return;
    }

    this.props
      .onAdd(new ModelUserPermissions(new DomainUserId(DomainUserType.NORMAL, this.state.username), this.state.permissions))
      .then(() => {
        this.setState({
          username: null,
          permissions: this._defaultPermissions
        })
      });
  }
}
