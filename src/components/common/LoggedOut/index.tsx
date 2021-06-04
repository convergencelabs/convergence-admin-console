/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ReactNode} from "react";
import { LogoutOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";
import {MessagePage} from "../MessagePage";
import logo from "../../../assets/images/logo.png";
import {Link} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../utils/mobx-utils";
import {AuthStore} from "../../../stores/AuthStore";
import {STORES} from "../../../stores/StoreConstants";

interface InjectedProps extends RouteComponentProps {
  authStore: AuthStore;
}

export class LoggedOutComponent extends React.Component<InjectedProps, {}> {
  public render(): ReactNode {
    return (
      <MessagePage>
        <div>
          <img alt="Convergence Logo" className={styles.logo} src={logo}/>
          <div className={styles.convergence}>CONVERGENCE</div>
        </div>
        <div className={styles.message}>
          <span className={styles.spacer}/>
          <LogoutOutlined className={styles.icon} />
          <span className={styles.title}>Logged Out</span>
          <span className={styles.spacer}/>
        </div>
        <div className={styles.text}>You have been logged out due to inactivity.</div>
        <div className={styles.action}>
          <div className={styles.text}><Link className={styles.link} to="#" onClick={this._login}>Click Here</Link> to log in again.</div>
        </div>
      </MessagePage>
    );
  }

  private _login = () => {
    this.props.authStore.clearTimedOut();
    this.props.history.push("/");
  }
}

const injections = [STORES.AUTH_STORE];
export const LoggedOut = injectAs<RouteComponentProps>(injections, LoggedOutComponent);