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

import {DomainId} from "../../models/DomainId";
import {AbstractDomainService} from "./AbstractDomainService";
import {ModelSnapshotPolicyData} from "./common-rest-data";
import {toModelSnapshotPolicy} from "./incoming-rest-data-converters";
import {ModelSnapshotPolicy} from "../../models/domain/ModelSnapshotPolicy";
import {toModelSnapshotPolicyData} from "./outgoing-rest-data-converters";
import {CollectionConfig} from "../../models/domain/CollectionConfig";

export class DomainConfigService extends AbstractDomainService {

  public getAnonymousAuthEnabled(domainId: DomainId): Promise<boolean> {
    const url = this._getDomainUrl(domainId,`config/anonymousAuth`);
    return this._get<{enabled: boolean}>(url).then(resp => resp.enabled);
  }

  public setAnonymousAuthEnabled(domainId: DomainId, enabled: boolean): Promise<void> {
    const body = {
      enabled
    };
    const url = this._getDomainUrl(domainId,`config/anonymousAuth`);
    return this._put<void>(url, body);
  }

  public getModelSnapshotPolicy(domainId: DomainId): Promise<ModelSnapshotPolicy> {
    const url = this._getDomainUrl(domainId,`config/modelSnapshotPolicy`);
    return this._get<ModelSnapshotPolicyData>(url)
      .then(toModelSnapshotPolicy);
  }

  public setModelSnapshotPolicy(domainId: DomainId, policy: ModelSnapshotPolicy): Promise<void> {
    const url = this._getDomainUrl(domainId,`config/modelSnapshotPolicy`);
    const data = toModelSnapshotPolicyData(policy);
    return this._put<void>(url, data);
  }

  public getCollectionConfig(domainId: DomainId): Promise<CollectionConfig> {
    const url = this._getDomainUrl(domainId,`config/collection`);
    return this._get<{ autoCreate: boolean }>(url).then(c => new CollectionConfig(c.autoCreate));
  }

  public setCollectionConfig(domainId: DomainId, config: CollectionConfig): Promise<void> {
    const url = this._getDomainUrl(domainId,`config/collection`);
    const entity = {autoCreate: config.autoCreate};
    return this._put<void>(url, entity);
  }
}

export const domainConfigService = new DomainConfigService();
