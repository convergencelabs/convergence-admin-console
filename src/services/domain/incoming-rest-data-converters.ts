import {Collection} from "../../models/domain/Collection";
import {
  CollectionData,
  CollectionPermissionsData,
  CollectionSummaryData,
  ModelSnapshotPolicyData
} from "./common-rest-data";
import {CollectionPermissions} from "../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../models/domain/ModelSnapshotPolicy";
import {CollectionSummary} from "../../models/domain/CollectionSummary";

export function toCollection(data: CollectionData): Collection {
  return new Collection(
    data.id,
    data.description,
    toCollectionPermissions(data.worldPermissions),
    data.overrideSnapshotPolicy,
    toModelSnapshotPolicy(data.snapshotPolicy));
}

export function toCollectionPermissions(data: CollectionPermissionsData): CollectionPermissions {
  return new CollectionPermissions(
    data.read,
    data.write,
    data.create,
    data.remove,
    data.manage);
}

export function toModelSnapshotPolicy(data?: ModelSnapshotPolicyData): ModelSnapshotPolicy | undefined {
  if (data) {
    return new ModelSnapshotPolicy(
      data.snapshotsEnabled,
      data.triggerByVersion,
      data.maximumVersionInterval,
      data.limitByVersion,
      data.minimumVersionInterval,
      data.triggerByTime,
      data.maximumTimeInterval,
      data.limitByTime,
      data.minimumTimeInterval);
  }
}

export function toCollectionSummary(data: CollectionSummaryData): CollectionSummary {
  return new CollectionSummary(
    data.id,
    data.description,
    data.modelCount);
}
