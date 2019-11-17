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

import * as React from 'react';
import {ReactNode} from 'react';
import styles from './styles.module.css';
import {BreadcrumbsStore, IBreadcrumbSegment} from "../../../stores/BreacrumsStore";
import {STORES} from "../../../stores/StoreConstants";
import {injectAs} from "../../../utils/mobx-utils";

export interface PageProps {
  breadcrumbs: IBreadcrumbSegment[];
  full?: boolean;
}

interface InjectedProps extends PageProps {
  breadcrumbsStore: BreadcrumbsStore;
}

export class PageComponent extends React.Component<InjectedProps,{}> {

  public componentDidMount(): void {
    this.props.breadcrumbsStore.setPath(this.props.breadcrumbs);
  }

  public render(): ReactNode {
    const className = this.props.full ? styles.pageFull : styles.page;
    return <div className={className}>{this.props.children}</div>;
  }
}

const injections = [STORES.BREADCRUMBS_STORE];
export const Page = injectAs<PageProps>(injections, PageComponent);
