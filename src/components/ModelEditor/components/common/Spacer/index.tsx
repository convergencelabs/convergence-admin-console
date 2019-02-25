import React, {ReactNode} from "react";
import styles from "./styles.module.scss";

export class Spacer extends React.Component<{}, {}> {
  public render(): ReactNode {
    return <div className={styles.spacer}><div className={styles.divider}/></div>;
  }
}
