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

import {Collection} from "../../models/domain/Collection";
import {
  CollectionData,
  CollectionPermissionsData,
  CollectionUpdateData,
  ModelSnapshotPolicyData
} from "./common-rest-data";
import {CollectionPermissions} from "../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../models/domain/ModelSnapshotPolicy";
import {CollectionUserPermissions} from "../../models/domain/CollectionUserPermissions";

export function toCollectionData(collection: Collection): CollectionData {

  return {
    id: collection.id,
    description: collection.description,
    worldPermissions: toCollectionPermissionsData(collection.worldPermissions),
    userPermissions: toUserPermissionsData(collection.userPermissions),
    overrideSnapshotPolicy: collection.overrideSnapshotPolicy,
    snapshotPolicy: toModelSnapshotPolicyData(collection.snapshotPolicy)
  };
}

export function toCollectionUpdateData(collection: Collection): CollectionUpdateData {
  return {
    description: collection.description,
    worldPermissions: toCollectionPermissionsData(collection.worldPermissions),
    userPermissions: toUserPermissionsData(collection.userPermissions),
    overrideSnapshotPolicy: collection.overrideSnapshotPolicy,
    snapshotPolicy: toModelSnapshotPolicyData(collection.snapshotPolicy)
  };
}

function toUserPermissionsData(userPermissions: CollectionUserPermissions[]): {[key: string]: CollectionPermissionsData} {
  const userPermissionsData: {[key: string]: CollectionPermissionsData} = {};
  userPermissions.forEach(cup => {
    userPermissionsData[cup.userId.username] = toCollectionPermissionsData(cup.permissions);
  });
  return userPermissionsData;
}

export function toCollectionPermissionsData(data: CollectionPermissions): CollectionPermissionsData {
  return new CollectionPermissions(
    data.read,
    data.write,
    data.create,
    data.remove,
    data.manage);
}

export function toModelSnapshotPolicyData(policy: ModelSnapshotPolicy): ModelSnapshotPolicyData {
  return {
    snapshotsEnabled: policy.snapshotsEnabled,
    triggerByVersion: policy.triggerByVersion,
    maximumVersionInterval: policy.maximumVersionInterval,
    limitByVersion: policy.limitByVersion,
    minimumVersionInterval: policy.minimumVersionInterval,
    triggerByTime: policy.triggerByTime,
    maximumTimeInterval: policy.maximumTimeInterval,
    limitByTime: policy.limitByTime,
    minimumTimeInterval: policy.minimumTimeInterval
  };
}
