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

export interface NewStringNodeProps {
  onCancel: () => void;
  onSubmit: () => void;
  onChange: (value: string) => void;
  value: string;
}

export class NewStringNode extends React.Component<NewStringNodeProps, {}> {

  private _input: HTMLTextAreaElement | null = null;

  constructor(props: NewStringNodeProps, context: any) {
    super(props, context);

    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._setInput = this._setInput.bind(this);
  }

  public componentDidMount(): void {
    this._input!.scrollTop = 0;
  }

  private _onKeyDown(event: any) {
    if ((event.key === 'Enter' && !event.shiftKey)) {
      this.props.onSubmit();
      event.stopPropagation();
      return false;
    } else if (event.key === 'Escape') {
      this.props.onCancel();
    }
  }

  private _onChange(_: any) {
    this.props.onChange(this._input!.value);
  }

  private _setInput(input: HTMLTextAreaElement) {
    this._input = input;
  }

  public render(): ReactNode {
    const value = this.props.value;
    const lines = value.split("\n").length;

    return (
      <textarea
        className="string-editor"
        value={this.props.value}
        rows={lines}
        ref={this._setInput}
        spellCheck={false}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
      />
    );
  }
}
