import React, {ReactNode} from "react";
import styles from './styles.module.css';
import {Icon} from "antd";

export interface CardTitleToolbarProps {
  title?: string;
  icon?: string;
}

export class CardTitleToolbar extends React.Component<CardTitleToolbarProps, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.toolbar}>
        <span><Icon type={this.props.icon}/> {this.props.title}</span>
        <span className={styles.spacer}/>
        {this.props.children}
      </div>
    )
  }
}
