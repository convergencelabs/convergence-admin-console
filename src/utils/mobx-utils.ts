import React from "react";
import {inject, IReactComponent, observer} from "mobx-react";

export function injectObserver<T>(stores: string[], comp: React.ComponentClass<any>): IReactComponent<T> {
  return inject(...stores)(observer(comp));
}

export function injectAs<T>(stores: string[], comp: React.ComponentClass<any>): IReactComponent<T> {
  return inject(...stores)(comp);
}
