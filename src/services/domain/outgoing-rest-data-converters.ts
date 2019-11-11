import {Collection} from "../../models/domain/Collection";
import {
  CollectionData,
  CollectionPermissionsData,
  CollectionSummaryData,
  CollectionUpdateData,
  ModelSnapshotPolicyData
} from "./common-rest-data";
import {CollectionPermissions} from "../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../models/domain/ModelSnapshotPolicy";
import {CollectionSummary} from "../../models/domain/CollectionSummary";

export function toCollectionData(collection: Collection): CollectionData {
  return {
    id: collection.id,
    description: collection.description,
    worldPermissions: toCollectionPermissionsData(collection.worldPermissions),
    overrideSnapshotPolicy: collection.overrideSnapshotPolicy,
    snapshotPolicy: toModelSnapshotPolicyData(collection.snapshotPolicy)
  };
}

export function toCollectionUpdateData(collection: Collection): CollectionUpdateData {
  return {
    description: collection.description,
    worldPermissions: toCollectionPermissionsData(collection.worldPermissions),
    overrideSnapshotPolicy: collection.overrideSnapshotPolicy,
    snapshotPolicy: toModelSnapshotPolicyData(collection.snapshotPolicy)
  };
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

export function toCollectionSummaryData(summary: CollectionSummary): CollectionSummaryData {
  return {
    id: summary.id,
    description: summary.description,
    modelCount: summary.modelCount
  };
}
