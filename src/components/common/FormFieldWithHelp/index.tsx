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
import styles from "./styles.module.css";
import {Icon, Tooltip} from "antd";

export interface FormFieldWithHelpProps {
  label: string;
  tooltip: string;
}

export class FormFieldWithHelp extends React.Component<FormFieldWithHelpProps, {}> {
  render(): ReactNode {
    return (
      <span>
        <span className={styles.label}>{this.props.label}</span>
        <Tooltip title={this.props.tooltip}><Icon className={styles.icon} type="question-circle-o"/></Tooltip>
      </span>
    );
  }
}
