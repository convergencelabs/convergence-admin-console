import React, {ReactNode} from 'react';
import styles from './styles.module.css';

export class DescriptionBox extends React.Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.descriptionBox}>
        {this.props.children}
      </div>
    );
  }
}
