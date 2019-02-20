import * as React from 'react';
import {ReactNode} from "react";
import styles from './styles.module.css';
import {BreadcrumbsProducer, breadcrumbStore} from "../../stores/BreacrumStore";

export interface PageProps {
  breadcrumbs: BreadcrumbsProducer;
  full?: boolean;
}

export class Page extends React.Component<PageProps,{}> {

  public componentDidMount(): void {
    breadcrumbStore.setBreadcrumbs(this.props.breadcrumbs.breadcrumbs());
  }

  public render(): ReactNode {
    const className = this.props.full ? styles.pageFull : styles.page;
    return <div className={className}>{this.props.children}</div>;
  }
}
