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

export interface ModelData {
  metaData: {
    id: string;
    collection: string;
    version: number
    createdTime: number,
    modifiedTime: number
  },
  data: any
}


export interface ModelPermissionSummaryData {
  overrideWorld: boolean;
  worldPermissions: ModelPermissionsData;
  userPermissions: ModelUserPermissionsData[];
}

export interface ModelPermissionsData {
  read: boolean;
  write: boolean;
  remove: boolean;
  manage: boolean;
}

export interface ModelUserPermissionsData {
  username: string;
  permissions: ModelPermissionsData;
}