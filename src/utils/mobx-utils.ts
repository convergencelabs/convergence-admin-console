/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import {inject, IReactComponent, observer} from "mobx-react";

export function injectObserver<T>(injections: string[], comp: React.ComponentClass<any>): IReactComponent<T> {
  return inject(...injections)(observer(comp));
}

export function injectAs<T>(injections: string[], comp: React.ComponentClass<any>): IReactComponent<T> {
  return inject(...injections)(comp);
}
