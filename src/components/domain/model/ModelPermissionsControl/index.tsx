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
import {Checkbox,} from "antd";
import {CheckboxChangeEvent} from "antd/lib/checkbox";
import {ModelPermissions} from "../../../../models/domain/ModelPermissions";
import {TypeChecker} from "../../../../utils/TypeChecker";

interface ModelPermissionsControlProps {
  initialValue?: ModelPermissions;
  value?: ModelPermissions;
  onChange?: (permissions: ModelPermissions) => void;
}

export interface ModelPermissionsControlState {
  permissions: ModelPermissions | null;
}

export class ModelPermissionsControl extends React.Component<ModelPermissionsControlProps, ModelPermissionsControlState> {
  constructor(props: ModelPermissionsControlProps) {
    super(props);

    // TODO validate the right combination of value / onChange vs initialValue
    const permissions = this.props.value ? null : this.props.initialValue || new ModelPermissions(false, false, false, false);
    this.state = {
      permissions
    };
  }

  public render(): ReactNode {
    const permissions = this._getPermissions();
    return (
      <React.Fragment>
        <Checkbox checked={permissions.read} onChange={this._readChange}>Read</Checkbox>
        <Checkbox checked={permissions.write} onChange={this._writeChange}>Write</Checkbox>
        <Checkbox checked={permissions.remove} onChange={this._removeChange}>Remove</Checkbox>
        <Checkbox checked={permissions.manage} onChange={this._manageChange}>Manage</Checkbox>
      </React.Fragment>
    );
  }

  private _getPermissions(): ModelPermissions {
    if (this.props.value) {
      return this.props.value;
    } else {
      return this.state.permissions!;
    }
  }

  private _readChange = (e: CheckboxChangeEvent) => {
    const read = e.target.checked;
    const permissions = this._getPermissions().copy({read});
    this._updatePermissions(permissions);
  }

  private _writeChange = (e: CheckboxChangeEvent) => {
    const write = e.target.checked;
    const permissions = this._getPermissions().copy({write});
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

  private _updatePermissions(permissions: ModelPermissions): void {
    if (TypeChecker.isFunction(this.props.onChange)) {
      this.props.onChange(permissions);
    }

    if (!this.props.value) {
      this.setState({permissions});
    }
  }
}
