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
import {DomainDescriptor} from "../../../models/DomainDescriptor";
import {DomainAvailability} from "../../../models/DomainAvailability";
import {DomainStatus} from "../../../models/DomainStatus";
import {Link} from "react-router-dom";
import styles from "./styles.module.css";
import {toDomainRoute} from "../../../utils/domain-url";

export function DomainBanner(props: { domainDescriptor: DomainDescriptor | null }): ReactElement | null {
  const {domainDescriptor} = props;
  if (domainDescriptor) {
    const link = toDomainRoute(domainDescriptor?.domainId, "settings/dangerous");
    const {status, availability} = domainDescriptor;
    if (status === DomainStatus.ERROR) {
      return (<div className={styles.error}>The Domain is in an Error State</div>);
    } else if (availability === DomainAvailability.OFFLINE) {
      return (<div className={styles.offline}>The Domain is Offline. This can be changed in the <Link className={styles.settingsLink} to={link}>Domain Settings</Link></div>);
    } else if (availability === DomainAvailability.MAINTENANCE) {
      return (<div className={styles.maintenance}>The Domain is in Maintenance Mode. This can be changed in the <Link className={styles.settingsLink} to={link}>Domain Settings</Link></div>);
    } else {
      return null;
    }
  } else {
    return null;
  }
}