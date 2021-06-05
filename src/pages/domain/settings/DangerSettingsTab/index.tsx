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
import {DomainService} from "../../../../services/DomainService";
import * as H from "history";
import {DomainSettingSection} from "../SettingsSection";
import {SERVICES} from "../../../../services/ServiceConstants";
import {injectAs} from "../../../../utils/mobx-utils";
import {DeleteDomain} from "./DeleteDomain";
import {ChangeAvailability} from "./ChangeAvailability";
import {ChangeDomainId} from "./DomainIdSetting";

export interface DangerousSettingsProps {
  domainId: DomainId;
  history: H.History;
}

interface InjectedProps extends DangerousSettingsProps {
  domainService: DomainService;
}

export interface DangerousSettingsState {
  domainId: string;
}

class DangerousSettingsComponent extends React.Component<InjectedProps, DangerousSettingsState> {

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      domainId: ""
    }
  }

  public render(): ReactNode {
    return (
        <DomainSettingSection>
          <ChangeAvailability />
          <ChangeDomainId history={this.props.history}/>
          <DeleteDomain history={this.props.history}/>
        </DomainSettingSection>
    );
  }


}

const injections = [SERVICES.DOMAIN_SERVICE];
export const DangerousSettings = injectAs<DangerousSettingsProps>(injections, DangerousSettingsComponent);
