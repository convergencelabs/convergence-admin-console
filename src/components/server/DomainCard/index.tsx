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

import React, {Component, ReactNode} from 'react';
import styles from './styles.module.css';
import {DomainDescriptor} from "../../../models/DomainDescriptor";
import {Button, Card, Input, Tooltip} from "antd";
import {SERVICES} from "../../../services/ServiceConstants";
import {ConfigService} from "../../../services/ConfigService";
import {injectObserver} from "../../../utils/mobx-utils";
import {domainRealtimeUrl, toDomainRoute} from "../../../utils/domain-url";
import {CopyAddOnButton} from "../../common/CopyAddonButton/";
import {DomainStatusIcon} from "../../common/DomainStatusIcon";
import {formatDomainStatus} from "../../../utils/format-utils";
import {DomainStatus} from "../../../models/DomainStatus";
import {DisableableLink} from "../../common/DisableableLink"
import classNames from "classnames";
import {STORES} from "../../../stores/StoreConstants";
import {ConfigStore} from "../../../stores/ConfigStore";
import {DomainId} from "../../../models/DomainId";
import {RouteComponentProps, withRouter} from "react-router";

export interface DomainCardProps {
  domain: DomainDescriptor
}

interface InjectedProps extends DomainCardProps, RouteComponentProps {
  configService: ConfigService;
  configStore: ConfigStore;
}

export class DomainCardComponent extends Component<InjectedProps, {}> {
  public render(): ReactNode {
    const props = this.props;
    const domain = this.props.domain;
    const url = domainRealtimeUrl(domain.namespace, domain.id);
    const disabled = domain.status === DomainStatus.INITIALIZING || domain.status === DomainStatus.DELETING;
    const cls: string[] = [];
    cls.push(styles.domainCard);
    if (disabled) {
      cls.push(styles.domainCardDisabled);
    }

    const className = classNames(...cls);
    const linkUrl = toDomainRoute(new DomainId(domain.namespace, domain.id), "");
    return (
      <Card className={className} hoverable={true}>
        <DisableableLink to={{pathname: linkUrl}} disabled={disabled}>
          <span className={styles.title}>{domain.displayName}</span>
        </DisableableLink>
        <span className={styles.status}>
          <Tooltip title={formatDomainStatus(domain.status)}>
            <span><DomainStatusIcon status={domain.status}/></span>
          </Tooltip>
        </span>
        <div className={styles.nsid}>{domain.namespace} / {domain.id}</div>
        <Input
          className={styles.url}
          value={url}
          addonAfter={<CopyAddOnButton copyText={url}/>}
        />
        <div className={styles.buttons}>
          <DomainCardButton link="" tooltip={"Dashboard"} icon="dashboard" disabled={disabled} {...props}/>
          <DomainCardButton link="users" tooltip={"Users"} icon="user" disabled={disabled} {...props}/>
          <DomainCardButton link="groups" tooltip={"Groups"} icon="team" disabled={disabled} {...props}/>
          <DomainCardButton link="sessions" tooltip={"Sessions"} icon="cloud" disabled={disabled} {...props}/>
          <DomainCardButton link="chats"  tooltip={"Chat"} icon="message" disabled={disabled} {...props}/>
          <DomainCardButton link="collections"  tooltip={"Collections"} icon="folder" disabled={disabled} {...props}/>
          <DomainCardButton link="models"  tooltip={"Models"} icon="file" disabled={disabled} {...props}/>
          <DomainCardButton link="authentication" tooltip={"Authentication"} icon="lock" disabled={disabled} {...props}/>
          <DomainCardButton link="settings" tooltip={"Settings"} icon="setting" disabled={disabled} {...props}/>
        </div>
      </Card>
    );
  }
}

interface DomainCardButtonProps extends RouteComponentProps {
  domain: DomainDescriptor
  icon: string;
  link: string;
  tooltip: string;
  disabled: boolean;
}

class DomainCardButton extends Component<DomainCardButtonProps, {}> {
  public render(): ReactNode {
    const {tooltip, icon, disabled} = this.props;
    return (
      <Tooltip title={tooltip} mouseEnterDelay={1}>
        <Button shape="circle" icon={icon} disabled={disabled} onClick={this._goto}/>
      </Tooltip>
    )
  };

  private _goto = () => {
    const {domain, link} = this.props;
    const url = toDomainRoute(new DomainId(domain.namespace, domain.id), link);
    this.props.history.push(url);
  }
}


const injections = [SERVICES.CONFIG_SERVICE, STORES.CONFIG_STORE];
export const DomainCard = injectObserver<DomainCardProps>(injections, withRouter(DomainCardComponent));
