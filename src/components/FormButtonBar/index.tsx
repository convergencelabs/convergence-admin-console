import * as React from 'react';
import {Component, ReactNode} from "react";
import styles from "./styles.module.css";

export class FormButtonBar extends Component<{}, {}> {
  render(): ReactNode {
    return (
      <div className={styles.buttons}>
        {this.props.children}
      </div>
    );
  }
}
