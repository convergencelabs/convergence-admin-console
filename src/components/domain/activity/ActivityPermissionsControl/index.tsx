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
import {Checkbox,} from "antd";
import {CheckboxChangeEvent} from "antd/lib/checkbox";
import {ActivityPermissions} from "../../../../models/domain/activity/ActivityPermissions";
import {TypeChecker} from "../../../../utils/TypeChecker";

interface ActivityPermissionsControlProps {
  initialValue?: ActivityPermissions;
  value?: ActivityPermissions;
  onChange?: (permissions: ActivityPermissions) => void;
}

export interface ActivityPermissionsControlState {
  permissions: ActivityPermissions | null;
}

export class ActivityPermissionsControl extends React.Component<ActivityPermissionsControlProps, ActivityPermissionsControlState> {
  constructor(props: ActivityPermissionsControlProps) {
    super(props);

    const permissions = this.props.value ? null : this.props.initialValue ||
        new ActivityPermissions(false, false, false, false, false,false);
    this.state = {
      permissions
    };
  }

  public render(): ReactNode {
    const permissions = this._getPermissions();
    return (
      <React.Fragment>
        <Checkbox checked={permissions.join} onChange={this._joinChange}>Join</Checkbox>
        <Checkbox checked={permissions.lurk} onChange={this._lurkChange}>Lurk</Checkbox>
        <Checkbox checked={permissions.viewState} onChange={this._viewStateChange}>View State</Checkbox>
        <Checkbox checked={permissions.setState} onChange={this._setStateChange}>Set State</Checkbox>
        <Checkbox checked={permissions.remove} onChange={this._removeChange}>Remove</Checkbox>
        <Checkbox checked={permissions.manage} onChange={this._manageChange}>Manage</Checkbox>
      </React.Fragment>
    );
  }

  private _getPermissions(): ActivityPermissions {
    if (this.props.value) {
      return this.props.value;
    } else {
      return this.state.permissions!;
    }
  }

  private _joinChange = (e: CheckboxChangeEvent) => {
    const join = e.target.checked;
    const permissions = this._getPermissions().copy({join});
    this._updatePermissions(permissions);
  }

  private _lurkChange = (e: CheckboxChangeEvent) => {
    const lurk = e.target.checked;
    const permissions = this._getPermissions().copy({lurk});
    this._updatePermissions(permissions);
  }

  private _viewStateChange = (e: CheckboxChangeEvent) => {
    const viewState = e.target.checked;
    const permissions = this._getPermissions().copy({viewState});
    this._updatePermissions(permissions);
  }

  private _setStateChange = (e: CheckboxChangeEvent) => {
    const setState = e.target.checked;
    const permissions = this._getPermissions().copy({setState});
    this._updatePermissions(permissions);
  }

  private _removeChange = (e: CheckboxChangeEvent) => {
    const remove = e.target.checked;
    const permissions = this._getPermissions().copy({remove});
    this._updatePermissions(permissions);
  }

  private _manageChange = (e: CheckboxChangeEvent) => {
    const manage = e.target.checked;
    const permissions = this._getPermissions().copy({manage});
    this._updatePermissions(permissions);
  }

  private _updatePermissions(permissions: ActivityPermissions): void {
    if (TypeChecker.isFunction(this.props.onChange)) {
      this.props.onChange(permissions);
    }

    if (!this.props.value) {
      this.setState({permissions});
    }
  }
}
