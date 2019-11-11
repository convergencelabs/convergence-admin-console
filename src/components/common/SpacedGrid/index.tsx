import * as React from 'react';
import {Component, ReactNode} from 'react';
import styles from "./styles.module.css";

export class SpacedGrid extends Component<{}, {}> {
  render(): ReactNode {
    return (
      <div className={styles.grid}>
        {this.props.children}
      </div>
    );
  }
}
