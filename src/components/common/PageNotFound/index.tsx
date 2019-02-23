import React, {ReactNode} from "react";
import {Icon} from "antd";
import styles from "./styles.module.css";

export class PageNotFound extends React.Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFound}>
          <Icon type="frown" className={styles.icon}/>
          <div className={styles.title}>Page Not Found</div>
          <div className={styles.text}>Unfortunately no page exists at this url.</div>
        </div>
      </div>
    );
  }
}