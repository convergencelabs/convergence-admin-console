import * as React from 'react';
import styles from "./style.module.css";

export class Root extends React.Component<{}, {}> {
  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default;
      return <DevTools position={{bottom: 0, right: 0}}/>;
    }
  }

  render() {
    return (
      <div className={styles.appRoot}>
        {this.props.children}
        {this.renderDevTool()}
      </div>
    );
  }
}
