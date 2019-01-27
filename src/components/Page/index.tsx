import * as React from 'react';
import {ReactNode} from "react";
import styles from './styles.module.css';
import {breadcrumbStore, IBreadcrumbSegment} from "../../stores/BreacrumStore";
import {Icon} from "antd";


export interface PageProps {
  title?: string;
  icon?: string;
  breadcrumbs: IBreadcrumbSegment[];
}

export class Page extends React.Component<PageProps,{}> {

  public componentDidMount(): void {
    breadcrumbStore.setBreadcrumbs(this.props.breadcrumbs);
  }

  public render(): ReactNode {
    const icon = this.props.icon ? <Icon className={styles.icon} type={this.props.icon} /> : null;
    const title = this.props.title ? <span className={styles.title}>{this.props.title}</span> : null;
    const header = icon || title ? <div className={styles.header}>{icon}{title}</div> : null;
     return (
       <div className={styles.page}>
         {header}
         <div className={styles.pageContent}>
           {this.props.children}
         </div>
       </div>
     )
  }
}
