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

import {DateElement} from "../DateElement";
import {ModelPathElement} from "../ModelPath";
import {LocalElement} from "./LocalElement";
import {ContainerElement} from "../ContainterElement";

export class LocalDateElement extends DateElement implements LocalElement {

  private _value: Date;
  private _fieldInParent: ModelPathElement;

  constructor(id: string, parent: ContainerElement<any>, fieldInParent: ModelPathElement, value: Date) {
    super(id, parent);
    this._value = value;
    this._fieldInParent = fieldInParent;
  }

  public relativePathFromParent(): ModelPathElement {
    return this._fieldInParent;
  }

  public toJSON(): any {
    return {
      $convergenceType: "date",
      value: this._value.toISOString()
    };
  }

  protected _getValue(): Date {
    return this._value;
  }

  protected _setValue(val: Date): void {
    this._value = val;
  }

  _setFieldInParent(field: ModelPathElement): void {
    this._fieldInParent = field;
  }
}
