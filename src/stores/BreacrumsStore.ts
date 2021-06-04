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

import {action, makeAutoObservable, observable} from "mobx";
import {ReactNode} from "react";
import {DomainId} from "../models/DomainId";

export interface IBreadcrumbSegment {
  title?: string;
  link?: string;
  icon?: ReactNode;
  renderer?: () => ReactNode;
}

export class BreadcrumbsStore {
  public breadcrumbs: IBreadcrumbSegment[] = [];
  private _domainId: DomainId | null = null;
  private _path: IBreadcrumbSegment[] = [];

  constructor() {
    makeAutoObservable(this, {
      breadcrumbs: observable,
      setPath: action,
      setDomain: action
    });
  }

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

export const breadcrumbsStore = new BreadcrumbsStore();
