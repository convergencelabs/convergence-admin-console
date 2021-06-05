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
import {Button, Collapse, Form, Select} from "antd";
import {DescriptionBox} from "../../../../components/common/DescriptionBox";
import FormItem from "antd/es/form/FormItem";
import {FormButtonBar} from "../../../../components/common/FormButtonBar";
import {SERVICES} from "../../../../services/ServiceConstants";
import {injectAs} from "../../../../utils/mobx-utils";
import {STORES} from "../../../../stores/StoreConstants";
import {ActiveDomainStore} from "../../../../stores/ActiveDomainStore";

export interface ChangeAvailabilityProps {
}

export interface InjectedProps extends ChangeAvailabilityProps {
  domainService: DomainService;
  activeDomainStore: ActiveDomainStore;
}

class DomainAvailabilityCard extends Component<InjectedProps> {

  public render(): ReactNode {
    return (
        <Collapse  defaultActiveKey={['1']}>
          <Collapse.Panel header="Availability" key="1">
            <DescriptionBox>
              <p>
                Setting the availability to Maintenance mode will not allow users to connect
                to the domain, but the Convergence Admin Console will be fully functional.
                Connecting users will be told that the domain is in maintenance mode. Setting
                the availability to offline, will disallow all users from connecting. The Convergence
                Admin Console will only allow the changing of settings. Users that try to connect
                will be told that the domain does not exist.
              </p>
            </DescriptionBox>
            <div>
              <Form layout="vertical" onFinish={this._onFinish}>
                <FormItem name="availability"
                          label="Availability"
                          initialValue={this.props.activeDomainStore.domainDescriptor!.availability}
                          required>
                  <Select>
                    <Select.Option value="online">Online</Select.Option>
                    <Select.Option value="maintenance">Maintenance</Select.Option>
                    <Select.Option value="offline">Offline</Select.Option>
                  </Select>
                </FormItem>
                <FormButtonBar>
                  <Button htmlType="submit" type="primary">Apply</Button>
                </FormButtonBar>
              </Form>
            </div>
          </Collapse.Panel>
        </Collapse>
    );
  }

  private _onFinish = (values: any) => {
    const {availability} = values;
    this.props.domainService.setDomainAvailability(
        this.props.activeDomainStore.domainDescriptor!.domainId, availability)
        .then(() =>{
          return this.props.activeDomainStore.refreshDomainDescriptor();
        });
  }
}

const injections = [SERVICES.DOMAIN_SERVICE, STORES.ACTIVE_DOMAIN_STORE];
export const ChangeAvailability = injectAs<ChangeAvailabilityProps>(injections, DomainAvailabilityCard);
