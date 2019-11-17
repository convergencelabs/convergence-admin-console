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
