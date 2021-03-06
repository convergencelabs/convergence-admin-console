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
import {ActivityUserPermissions} from "../../../../models/domain/activity/ActivityUserPermissions";
import {ActivityPermissionsControl} from "../ActivityPermissionsControl";
import {DomainUsernameAutoComplete} from "../../user/DomainUsernameAutoComplete";
import styles from "./styles.module.css";
import {DomainUserType, DomainUserId} from "@convergence/convergence";

export interface SetActivityUserPermissionControlProps {
  domainId: DomainId;

  onSetPermissions(userPermissions: ActivityUserPermissions): void;
}

export interface AddActivityUserPermissionControlState {
  username: string | null;
  permissions: ActivityPermissions;
}

export class SetActivityUserPermissionControl extends React.Component<SetActivityUserPermissionControlProps, AddActivityUserPermissionControlState> {
  private readonly _defaultPermissions: ActivityPermissions;

  constructor(props: SetActivityUserPermissionControlProps) {
    super(props);

    this._defaultPermissions = new ActivityPermissions(false, false, false, false, false, false);

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

  private _onUsernameChanged = (username: string) => {
    this.setState({username});
  }

  private _onPermissionsChanged = (permissions: ActivityPermissions) => {
    this.setState({permissions});
  }

  private _onAdd = () => {
    if (!this.state.username) {
      return;
    }

    this.props.onSetPermissions(new ActivityUserPermissions(
        new DomainUserId(DomainUserType.NORMAL, this.state.username),
        this.state.permissions
    ));

    this.setState({
      username: null,
      permissions: this._defaultPermissions
    });
  }
}
