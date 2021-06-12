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
import {DomainId} from "../../../../models/DomainId";
import {InfoTable, InfoTableRow} from "../../../../components/server/InfoTable";
import {injectObserver} from "../../../../utils/mobx-utils";
import {formatBytes} from "../../../../utils/format-utils";
import {STORES} from "../../../../stores/StoreConstants";
import {ActiveDomainStore} from "../../../../stores/ActiveDomainStore";

export interface DomainStatsProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainStatsProps {
  activeDomainStore: ActiveDomainStore;
}

export class DomainStatsComponent extends React.Component<InjectedProps> {

  public render(): ReactNode {
    const {domainStats} = this.props.activeDomainStore;
    return domainStats !== null ?
      (
        <InfoTable>
          <InfoTableRow label="Active Sessions">{domainStats.activeSessionCount}</InfoTableRow>
          <InfoTableRow label="Total Users">{domainStats.userCount}</InfoTableRow>
          <InfoTableRow label="Total Models">{domainStats.modelCount}</InfoTableRow>
          <InfoTableRow label="Storage">{formatBytes(domainStats.dbSize, 1)}</InfoTableRow>
        </InfoTable>
      ) :
      null;
  }
}

const injections = [STORES.ACTIVE_DOMAIN_STORE];
export const DomainStats = injectObserver<DomainStatsProps>(injections, DomainStatsComponent);
