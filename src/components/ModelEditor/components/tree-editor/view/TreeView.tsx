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

import React from "react";
import {ObjectNodeRenderer} from "./node/ObjectNodeRenderer";
import {TreeModel} from "../model/TreeModel";
import {ObjectNode} from "../model/ObjectNode";
import classNames from "classnames";
import {Subscription} from "rxjs";

export interface TreeViewProps {
  model: TreeModel;
}

export class TreeView extends React.Component<TreeViewProps, {}> {

  private _treeSubscription: Subscription | null;

  constructor(props: TreeViewProps) {
    super(props);

    this._treeSubscription = null;
  }

  public componentWillMount(): void {
    this._treeSubscription = this.props.model.events()
      .subscribe(() => {
        this.forceUpdate();
      });
  }

  public componentWillUnmount(): void {
    if (this._treeSubscription !== null) {
      this._treeSubscription.unsubscribe();
    }
  }

  public render(): JSX.Element {
    const classes = classNames({
      "sapphire-tree": true,
      "selectable": this.props.model.isSelectable(),
      "editable": this.props.model.isEditable()
    });

    return (
      <div className={classes}>
        <div className="sapphire-tree-content">
          <ObjectNodeRenderer label="$"
                              node={this.props.model.root() as ObjectNode}
                              editableLabel={false}/>
        </div>
      </div>
    );
  }
}
