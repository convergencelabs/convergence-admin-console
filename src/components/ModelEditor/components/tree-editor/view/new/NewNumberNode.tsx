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
import {AutoWidthInputField} from "../common/AutoWidthInputField";

export interface NewNumberNodeProps {
  onCancel: () => void;
  onSubmit: () => void;
  onChange: (value: number) => void;
  value: number;
  minWidth: number;
}

export class NewNumberNode extends React.Component<NewNumberNodeProps, {}> {

  constructor(props: NewNumberNodeProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  private onChange(value: string): void {
    const num: number = Number(value);
    this.props.onChange(num);
  }

  public render(): ReactNode {
    return (
      <AutoWidthInputField
        className="number-editor"
        type="number"
        minWidth={this.props.minWidth}
        padding={18}
        value={this.props.value + ""}
        onChange={this.onChange}
        onEscape={this.props.onCancel}
        onEnter={this.props.onSubmit}
      />
    );
  }
}
