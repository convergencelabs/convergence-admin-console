/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
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
import {ActivityPermissions} from "../../../../models/domain/activity/ActivityPermissions";
import {ActivityPermissionsControl} from "../ActivityPermissionsControl";
import styles from "./styles.module.css";
import {DomainGroupAutoComplete} from "../../group/DomainUserGroupAutoComplete";
import {ActivityGroupPermissions} from "../../../../models/domain/activity/ActivityGroupPermissions";

export interface SetActivityGroupPermissionControlProps {
  domainId: DomainId;

  onSetPermissions(groupPermissions: ActivityGroupPermissions): void;
}

export interface SetActivityUserPermissionControlState {
  groupId: string | null;
  permissions: ActivityPermissions;
}

export class SetActivityUserPermissionControl extends React.Component<SetActivityGroupPermissionControlProps, SetActivityUserPermissionControlState> {
  private readonly _defaultPermissions: ActivityPermissions;

  constructor(props: SetActivityGroupPermissionControlProps) {
    super(props);

    this._defaultPermissions = new ActivityPermissions(false, false, false, false, false, false);

    this.state = {
      groupId: null,
      permissions: this._defaultPermissions
    }
  }

  public render(): ReactNode {
    const disabled = this.state.groupId === "" || this.state.groupId === undefined;
    return (
        <div className={styles.container}>
          <DomainGroupAutoComplete
              domainId={this.props.domainId}
              className={styles.groupId}
              value={this.state.groupId}
              onChange={this._onUsernameChanged}
              placeholder="Select Group"
          />
          <ActivityPermissionsControl
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

  private _onUsernameChanged = (groupId: string) => {
    this.setState({groupId});
  }

  private _onPermissionsChanged = (permissions: ActivityPermissions) => {
    this.setState({permissions});
  }

  private _onAdd = () => {
    if (!this.state.groupId) {
      return;
    }

    this.props.onSetPermissions(
      new ActivityGroupPermissions(this.state.groupId!, this.state.permissions));

    this.setState({
      groupId: null,
      permissions: this._defaultPermissions
    });
  }
}
