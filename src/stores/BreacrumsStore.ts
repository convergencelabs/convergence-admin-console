import {action, decorate, observable} from "mobx";
import {ReactNode} from "react";
import {DomainId} from "../models/DomainId";
import {configStore} from "./ConfigStore";

export interface IBreadcrumbSegment {
  title?: string;
  link?: string;
  icon?: string;
  renderer?: () => ReactNode;
}

export class BreadcrumbsStore {
  public breadcrumbs: IBreadcrumbSegment[] = [];
  private _domainId: DomainId | null = null;
  private _path: IBreadcrumbSegment[] = [];

  public setDomain(domainId: DomainId | null): void {
    this._domainId = domainId;
    this._update();
  }

  public setPath(path: IBreadcrumbSegment[]): void {
    this._path = path;
    this._update();
  }

  private _update(): void {
    const segments: IBreadcrumbSegment[] = [];

    if (this._domainId !== null) {
      segments.push({
        title: "Domains",
        link: "/domains"
      });

      segments.push({
        title: this._domainId.namespace
      });

      segments.push({
        title: this._domainId.id
      });
    }

    if (this._path) {
      segments.push(...this._path);
    }

    this.breadcrumbs = segments;
  }
}


decorate(BreadcrumbsStore, {
  breadcrumbs: observable,
  setPath: action,
  setDomain: action
});

export const breadcrumbsStore = new BreadcrumbsStore();
