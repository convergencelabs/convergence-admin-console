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
import {ActivityPermissionsControl} from "../ActivityPermissionsControl";
import {ActivityGroupPermissions} from "../../../../models/domain/ActivityGroupPermissions";
import {ActivityPermissions} from "../../../../models/domain/ActivityPermissions";

interface ActivityGroupPermissionsEditorProps {
  value: ActivityGroupPermissions;
  onChange(userPermissions: ActivityGroupPermissions): void
}

export class ActivityGroupPermissionsEditor extends React.Component<ActivityGroupPermissionsEditorProps, {}> {
  public render(): ReactNode {
    return (<ActivityPermissionsControl value={this.props.value.permissions} onChange={this._onChange}/>);
  }

  private _onChange = (permissions: ActivityPermissions) => {
    const userPermissions = this.props.value.copy({permissions});
    this.props.onChange(userPermissions);
  }
}
