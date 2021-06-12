/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */
import React, {ReactElement} from "react";
import styles from "./styles.module.css";

export function OfflineOverlay(props: { online: boolean, secondsUntilNextTry: number | null }): ReactElement | null {
  const {online, secondsUntilNextTry} = props;

  if (online) {
    return null;
  } else {
    const remainingText = secondsUntilNextTry == null ? "now" : `again in ${secondsUntilNextTry} seconds`
    return (
      <div className={styles.overlay}>
        <div className={styles.banner}>The Convergence Server appears to be Offline. Checking {remainingText}.</div>
      </div>
    );
  }
}
