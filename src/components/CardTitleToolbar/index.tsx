import * as React from 'react';
import styles from './styles.module.css';
import {Icon} from "antd";

export interface CartTitleToolbarProps {
  title?: string;
  icon?: string;
}

export class CartTitleToolbar extends React.Component<CartTitleToolbarProps, {}> {
  render() {
    return (
      <div className={styles.toolbar}>
        <span><Icon type={this.props.icon}/> {this.props.title}</span>
        <span className={styles.spacer}/>
        {this.props.children}
      </div>
    )
  }
}
