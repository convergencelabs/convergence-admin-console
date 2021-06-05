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

import React, {Component, ReactNode} from "react";
import {DomainService} from "../../../../services/DomainService";
import {Button, Collapse, Form, Input, notification} from "antd";
import {DescriptionBox} from "../../../../components/common/DescriptionBox";
import FormItem from "antd/es/form/FormItem";
import {FormButtonBar} from "../../../../components/common/FormButtonBar";
import {SERVICES} from "../../../../services/ServiceConstants";
import {injectAs} from "../../../../utils/mobx-utils";
import {STORES} from "../../../../stores/StoreConstants";
import {ActiveDomainStore} from "../../../../stores/ActiveDomainStore";
import {DomainAvailability} from "../../../../models/DomainAvailability";
import * as H from "history";
import {toDomainRoute} from "../../../../utils/domain-url";
import {DomainId} from "../../../../models/DomainId";

export interface DomainAvailabilityCardProps {
  history: H.History;
}

export interface InjectedProps extends DomainAvailabilityCardProps {
  domainService: DomainService;
  activeDomainStore: ActiveDomainStore;
}

export interface DomainAvailabilitySettingsState {
  loaded: boolean;
}

class ChangeDomainIdComponent extends Component<InjectedProps, DomainAvailabilitySettingsState> {

  public render(): ReactNode {
    const disabled= this.props.activeDomainStore.domainDescriptor!.availability !== DomainAvailability.OFFLINE;
    return (
        <Collapse defaultActiveKey={[]}>
          <Collapse.Panel header="Change Domain Id" key="1">
            <DescriptionBox>
              <p>
                Changing the id of the domain will change the connection url. You may
                have to update applications that connect to this domain.  To edit the
                domain's id, it must be offline.
              </p>
            </DescriptionBox>
            <div>
              <Form layout="vertical" onFinish={this._onFinish}>
                <FormItem name="id"
                          label="Domain Id"
                          initialValue={this.props.activeDomainStore.domainDescriptor!.domainId.id}
                          rules={[{required: true, type: "string"}]}
                          required>
                  <Input placeholder="Enter a Domain Id"
                         disabled={disabled}
                  />
                </FormItem>
                <FormButtonBar>
                  <Button htmlType="submit"
                          disabled={disabled}
                          type="primary">Apply</Button>
                </FormButtonBar>
              </Form>
            </div>
          </Collapse.Panel>
        </Collapse>
    );
  }

  private _onFinish = (values: any) => {
    const {id} = values;
    const domainId = this.props.activeDomainStore.domainDescriptor!.domainId;
    this.props.domainService
        .changeDomainId(domainId, id)
        .then(() => {
          notification.success({
            message: "Domain Id Changed",
            description: `The domain id was changed to '${id}'`
          });
          const newDomainId = new DomainId(domainId.namespace, id)
          const url = toDomainRoute(newDomainId, "settings/dangerous");
          this.props.history.push(url, {namespace: domainId.namespace, domainId: domainId.id});
          this.props.activeDomainStore.activateDomain(newDomainId).then(() => {});
        })
        .catch((err: any) => {
          console.error(err);
          notification.error({
            message: "Domain Id Not Updated",
            description: `There was an error updating the domain id .`
          });
        });
  }
}

const injections = [SERVICES.DOMAIN_SERVICE, STORES.ACTIVE_DOMAIN_STORE];
export const ChangeDomainId = injectAs<DomainAvailabilityCardProps>(injections, ChangeDomainIdComponent);
