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
import {inject, IReactComponent, observer} from "mobx-react";

export function injectObserver<T>(injections: string[], comp: React.ComponentClass<any>): IReactComponent<T> {
  return inject(...injections)(observer(comp));
}

export function injectAs<T>(injections: string[], comp: React.ComponentClass<any>): IReactComponent<T> {
  return inject(...injections)(comp);
}
