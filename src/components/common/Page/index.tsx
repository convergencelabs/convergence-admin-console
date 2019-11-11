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
