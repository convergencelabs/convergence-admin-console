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
import {CollectionPermissions} from "../../../../models/domain/CollectionPermissions";
import {CollectionUserPermissions} from "../../../../models/domain/CollectionUserPermissions";
import {CollectionPermissionsControl} from "../CollectionPermissionsControl";
import {DomainUsernameAutoComplete} from "../../user/DomainUsernameAutoComplete";
import styles from "./styles.module.css";

interface SetCollectionUserPermissionControlProps {
  domainId: DomainId;

  onSetPermissions(userPermissions: CollectionUserPermissions): void;
}

interface AddCollectionUserPermissionControlState {
  username: string;
  permissions: CollectionPermissions;
}

export class AddCollectionUserPermissionControl extends React.Component<SetCollectionUserPermissionControlProps, AddCollectionUserPermissionControlState> {
  private readonly _defaultPermissions: CollectionPermissions;

  constructor(props: SetCollectionUserPermissionControlProps) {
    super(props);

    this._defaultPermissions = new CollectionPermissions(false, false, false, false, false);

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
          <CollectionPermissionsControl
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

  private _onPermissionsChanged = (permissions: CollectionPermissions) => {
    this.setState({permissions});
  }

  private _onAdd = () => {
    this.props.onSetPermissions(new CollectionUserPermissions(
                new DomainUserId(DomainUserType.NORMAL, this.state.username),
                this.state.permissions
    ));

    this.setState({
      username: "",
      permissions: this._defaultPermissions
    });
  }
}
