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
import {formatDomainAvailability, formatDomainStatus} from "../../../utils/format-utils";
import {DomainStatus} from "../../../models/DomainStatus";
import {DisableableLink} from "../../common/DisableableLink"
import classNames from "classnames";
import {STORES} from "../../../stores/StoreConstants";
import {ConfigStore} from "../../../stores/ConfigStore";
import {RouteComponentProps, withRouter} from "react-router";
import {DomainAvailabilityIcon} from "../../common/DomainAvailabilityIcon";
import {
  BlockOutlined,
  CloudOutlined,
  DashboardOutlined,
  FileOutlined,
  FolderOutlined,
  LockOutlined,
  MessageOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import {DomainAvailability} from "../../../models/DomainAvailability";
import {FormButtonBar} from "../../common/FormButtonBar";
import {DomainId} from "../../../models/DomainId";

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
    const url = domainRealtimeUrl(domain.domainId);
    const disabled = domain.status !== DomainStatus.READY;
    const offline = domain.availability === DomainAvailability.OFFLINE;
    const upgradeNeed = domain.status === DomainStatus.SCHEMA_UPGRADE_REQUIRED;

    const cls: string[] = [];
    cls.push(styles.domainCard);
    if (disabled) {
      cls.push(styles.domainCardDisabled);
    }

    const className = classNames(...cls);
    const linkUrl = toDomainRoute(domain.domainId, "");
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
          <span className={styles.status}>
          <Tooltip title={formatDomainAvailability(domain.availability)}>
            <span><DomainAvailabilityIcon availability={domain.availability}/></span>
          </Tooltip>
        </span>
          <div className={styles.nsid}>{domain.domainId.namespace} / {domain.domainId.id}</div>
          <Input
              className={styles.url}
              value={url}
              addonAfter={<CopyAddOnButton copyText={url}/>}
          />
          {upgradeNeed ?
              this._renderUpgradeSchemaButton(domain.domainId) :
              this._renderButtons(props, disabled, offline)
          }
        </Card>
    );
  }

  private _renderUpgradeSchemaButton(domainId: DomainId) {
    const link = toDomainRoute(domainId, "upgrade")
    return (
        <FormButtonBar>
          <Button type="primary"
                  className={styles.upgradeButton}
                  href={link}
          >Upgrade Database</Button>
        </FormButtonBar>
    )
  }

  private _renderButtons(props: InjectedProps, disabled: boolean, offline: boolean) {
    return <div className={styles.buttons}>
      <DomainCardButton link="" tooltip={"Dashboard"} icon={<DashboardOutlined/>} disabled={disabled} {...props}/>
      <DomainCardButton link="users" tooltip={"Users"} icon={<UserOutlined/>}
                        disabled={disabled || offline} {...props}/>
      <DomainCardButton link="groups" tooltip={"Groups"} icon={<TeamOutlined/>}
                        disabled={disabled || offline} {...props}/>
      <DomainCardButton link="sessions" tooltip={"Sessions"} icon={<CloudOutlined/>}
                        disabled={disabled || offline} {...props}/>
      <DomainCardButton link="collections" tooltip={"Collections"} icon={<FolderOutlined/>}
                        disabled={disabled || offline} {...props}/>
      <DomainCardButton link="models" tooltip={"Models"} icon={<FileOutlined/>}
                        disabled={disabled || offline} {...props}/>
      <DomainCardButton link="chats" tooltip={"Chat"} icon={<MessageOutlined/>}
                        disabled={disabled || offline} {...props}/>
      <DomainCardButton link="activities" tooltip={"Activities"} icon={<BlockOutlined/>}
                        disabled={disabled || offline} {...props}/>
      <DomainCardButton link="authentication" tooltip={"Authentication"} icon={<LockOutlined/>}
                        disabled={disabled} {...props}/>
      <DomainCardButton link="settings" tooltip={"Settings"} icon={<SettingOutlined/>}
                        disabled={disabled} {...props}/>
    </div>;
  }
}

interface DomainCardButtonProps extends RouteComponentProps {
  domain: DomainDescriptor
  icon: ReactNode;
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
    );
  };

  private _goto = () => {
    const {domain, link} = this.props;
    const url = toDomainRoute(domain.domainId, link);
    this.props.history.push(url);
  }
}


const injections = [SERVICES.CONFIG_SERVICE, STORES.CONFIG_STORE];
export const DomainCard = injectObserver<DomainCardProps>(injections, withRouter(DomainCardComponent));
