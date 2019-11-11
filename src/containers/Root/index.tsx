import * as React from 'react';
import styles from "./style.module.css";

export class Root extends React.Component<{}, {}> {
  render() {
    return (
      <div className={styles.appRoot}>
        {this.props.children}
      </div>
    );
  }
}
