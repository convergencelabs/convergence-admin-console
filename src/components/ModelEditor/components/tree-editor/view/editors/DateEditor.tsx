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

import React from 'react';
import {DateNode} from "../../model/DateNode";
import {DateUtils} from "../../../../utils/DateUtils";
import classNames from "classnames";

export interface DateEditorProps {
  value?: Date;
  node?: DateNode;
  onStopEdit?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  onChange?: (value: Date) => void;
}

export interface DateEditorState {
  value: string;
  valid: boolean;
}

export class DateEditor extends React.Component<DateEditorProps, DateEditorState> {

  private input: HTMLInputElement | null = null;

  constructor(props: DateEditorProps) {
    super(props);

    let value: Date;
    if ((props.node !== undefined && props.value !== undefined) ||
      (props.node === undefined && props.value === undefined)) {
      throw new Error("node or value must be set, but not both.");
    } else if (props.node) {
      value = props.node.element().value();
    } else {
      value = props.value!;
    }

    this.state = {
      value: DateUtils.formatDate(value),
      valid: true
    };

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onKeyDown(event: any) {
    if (event.key === 'Enter') {
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
      event.stopPropagation();
      return false;
    } else if (event.key === 'Escape') {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    }
  }

  onChange(event: any) {
    const dateStr = this.input!.value;
    const valid: boolean = DateUtils.validate(dateStr);

    this.setState({
      value: dateStr,
      valid: valid
    });

    if (valid) {
      const date = DateUtils.parseDate(dateStr);
      if (this.props.onChange ) {
        this.props.onChange(date);
      }

      // We are editing an existing node.
      if (this.props.node) {
        this.props.node.element().value(date);
      }
    }
  }

  onBlur(event: any) {
    if (this.props.onStopEdit) {
      this.props.onStopEdit();
    }
  }

  onMouseLeave(): void {
    if (this.input !== document.activeElement && this.props.onStopEdit) {
      this.props.onStopEdit();
    }
  }

  render() {
    const date = this.state.value;
    const classes = classNames({
      "date-editor": true,
      invalid: !this.state.valid
    });

    return (
      <input
        className={classes}
        type="text"
        value={date}
        ref={e => this.input = e}
        spellCheck={false}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onMouseLeave={this.onMouseLeave}
      />
    );
  }
}
