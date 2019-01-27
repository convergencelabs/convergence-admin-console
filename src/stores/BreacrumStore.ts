import {action, decorate, observable} from "mobx";
import {ReactNode} from "react";
import {match} from "react-router";

export class BreadcrumbStore {
  public breadcrumbs: IBreadcrumbSegment[] = [];

  public setBreadcrumbs(breadcrumbs: IBreadcrumbSegment[]): void {
    this.breadcrumbs = breadcrumbs;
  }
}

decorate(BreadcrumbStore, {
  breadcrumbs: observable,
  setBreadcrumbs: action
});

export interface IBreadcrumbSegment {
  title?: string;
  link?: string;
  icon?: string;
  renderer?: () => ReactNode;
}

export class BreadcrumbsProducer {
  public breadcrumbs(): IBreadcrumbSegment[] {
    return [];
  }
}

export class BasicBreadcrumbsProducer {
  private readonly _segments: IBreadcrumbSegment[];
  constructor(segments: IBreadcrumbSegment[] = []) {
    this._segments = segments;
  }

  public breadcrumbs(): IBreadcrumbSegment[] {
    return this._segments;
  }
}

export const breadcrumbStore = new BreadcrumbStore();
