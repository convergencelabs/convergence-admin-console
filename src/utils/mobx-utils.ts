import React from "react";
import {inject, IReactComponent, observer} from "mobx-react";

export function injectObserver<T>(injections: string[], comp: React.ComponentClass<any>): IReactComponent<T> {
  return inject(...injections)(observer(comp));
}

export function injectAs<T>(injections: string[], comp: React.ComponentClass<any>): IReactComponent<T> {
  return inject(...injections)(comp);
}
