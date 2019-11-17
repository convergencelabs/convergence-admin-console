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

import React, {ReactNode} from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export interface ToolbarRadioButtonProps {
  icon: IconProp;
  tooltip: string;
  enabled: boolean;
  selected: boolean;
  onSelect: () => void;
}

export class ToolbarRadioButton extends React.Component<ToolbarRadioButtonProps, {}> {

  public render(): ReactNode {
    const className = classNames(
      styles.toolbarRadioButton,
      this.props.enabled ? styles.enabled : styles.disabled,
      this.props.selected ? styles.selected : ""
    );

    return (
      <span className={className} onClick={this._onSelect}>
        <FontAwesomeIcon size="sm" icon={this.props.icon}/>
      </span>
    );
  }

  private _onSelect = () => {
    if (this.props.enabled) {
      this.props.onSelect();
    }
  };
}
