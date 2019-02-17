export interface CollectionData {
  id: string;
  description: string;
  worldPermissions: CollectionPermissionsData;
  overrideSnapshotPolicy: boolean;
  snapshotPolicy?: ModelSnapshotPolicyData;
}

export interface CollectionUpdateData {
  description: string;
  worldPermissions: CollectionPermissionsData;
  overrideSnapshotPolicy: boolean;
  snapshotPolicy?: ModelSnapshotPolicyData;
}

export interface CollectionPermissionsData {
  read: boolean;
  write: boolean;
  remove: boolean;
  create: boolean;
  manage: boolean;
}

export interface CollectionSummaryData {
  id: string;
  description: string;
  modelCount: number;
}

export interface ModelSnapshotPolicyData {
  snapshotsEnabled: boolean;
  triggerByVersion: boolean;
  maximumVersionInterval: number;
  limitByVersion: boolean;
  minimumVersionInterval: number;
  triggerByTime: boolean;
  maximumTimeInterval: number;
  limitByTime: boolean;
  minimumTimeInterval: number;
}