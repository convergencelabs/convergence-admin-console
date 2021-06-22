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
  ActivityData,
  ChatInfoData,
  CollectionData,
  CollectionPermissionsData,
  CollectionSummaryData,
  DomainJwtKeyData,
  DomainSessionData,
  DomainUserData,
  DomainUserGroupData,
  DomainUserGroupInfoData,
  DomainUserGroupSummaryData,
  DomainUserIdData,
  ModelData,
  ModelPermissionsData,
  ModelPermissionSummaryData,
  ModelSnapshotPolicyData,
  ModelUserPermissionsData
} from "./common-rest-data";
import {CollectionPermissions} from "../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../models/domain/ModelSnapshotPolicy";
import {CollectionSummary} from "../../models/domain/CollectionSummary";
import {Model} from "../../models/domain/Model";
import {ModelPermissionSummary} from "../../models/domain/ModelPermissionsSummary";
import {ModelPermissions} from "../../models/domain/ModelPermissions";
import {ModelUserPermissions} from "../../models/domain/ModelUserPermissions";
import {DomainUserId, DomainUserType} from "@convergence/convergence";
import {DomainUser} from "../../models/domain/DomainUser";
import {DomainUserGroup} from "../../models/domain/DomainUserGroup";
import {DomainUserGroupInfo} from "../../models/domain/DomainUserGroupInfo";
import {DomainUserGroupSummary} from "../../models/domain/DomainUserGroupSummary";
import {DomainJwtKey} from "../../models/domain/DomainJwtKey";
import {DomainSession} from "../../models/domain/DomainSession";
import {ChatInfo} from "../../models/domain/ChatInfo";
import {
  ChatCreatedEvent,
  ChatEvent,
  ChatMessageEvent,
  ChatNameChangedEvent,
  ChatTopicChangedEvent,
  ChatUserAddedEvent,
  ChatUserJoinedEvent,
  ChatUserLeftEvent,
  ChatUserRemovedEvent
} from "../../models/domain/ChatEvent";
import {ConvergenceError} from "@convergence/convergence";
import {CollectionUserPermissions} from "../../models/domain/CollectionUserPermissions";
import {ActivityInfo} from "../../models/domain/activity/ActivityInfo";

export function toCollection(data: CollectionData): Collection {
  const userPermissions = Object.keys(data.userPermissions).map(username => {
    return new CollectionUserPermissions(
        new DomainUserId(DomainUserType.NORMAL, username),
        toCollectionPermissions(data.userPermissions[username])
    );
  })
  return new Collection(
    data.id,
    data.description,
    toCollectionPermissions(data.worldPermissions),
    userPermissions,
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

export function toModelSnapshotPolicy(data: ModelSnapshotPolicyData): ModelSnapshotPolicy {
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

export function toCollectionSummary(data: CollectionSummaryData): CollectionSummary {
  return new CollectionSummary(
    data.id,
    data.description,
    data.modelCount);
}

export function toModel(data: ModelData): Model {
  return new Model(
    data.id,
    data.collection,
    data.version,
    new Date(data.createdTime),
    new Date(data.modifiedTime),
    data.data
  );
}

export function toModelPermissionSummary(data: ModelPermissionSummaryData): ModelPermissionSummary {
  return new ModelPermissionSummary(
    data.overrideWorld,
    toModelPermissions(data.worldPermissions),
    data.userPermissions.map(toModelUserPermissions)
  );
}

export function toModelPermissions(data: ModelPermissionsData): ModelPermissions {
  return new ModelPermissions(
    data.read,
    data.write,
    data.remove,
    data.manage
  )
}

export function toModelUserPermissions(data: ModelUserPermissionsData): ModelUserPermissions {
  return new ModelUserPermissions(
    toDomainUserId(data.userId),
    toModelPermissions(data.permissions)
  );
}

export function toDomainUser(data: DomainUserData): DomainUser {
  return new DomainUser(
    data.username,
    data.displayName,
    data.firstName,
    data.lastName,
    data.email,
    data.lastLogin ? new Date(data.lastLogin) : undefined,
    data.disabled);
}

export function toDomainUserId(data: DomainUserIdData): DomainUserId {
  return new DomainUserId(data.userType as DomainUserType, data.username);
}

export function toDomainUserGroup(data: DomainUserGroupData): DomainUserGroup {
  return new DomainUserGroup(
    data.id,
    data.description,
    data.members);
}

export function toDomainUserGroupInfo(data: DomainUserGroupInfoData): DomainUserGroupInfo {
  return new DomainUserGroupInfo(
    data.id,
    data.description);
}

export function toDomainUserGroupSummary(data: DomainUserGroupSummaryData): DomainUserGroupSummary {
  return new DomainUserGroupSummary(
    data.id,
    data.description,
    data.members);
}

export function toDomainJwtKey(data: DomainJwtKeyData): DomainJwtKey {
  return new DomainJwtKey(
    data.id,
    data.description,
    new Date(data.updated),
    data.key,
    data.enabled
  );
}

export function toDomainSession(data: DomainSessionData): DomainSession {
  return new DomainSession(
    data.id,
    new DomainUserId(data.userType as DomainUserType, data.username),
    new Date(data.connected),
    data.disconnected ? new Date(data.disconnected) : null,
    data.authMethod,
    data.client,
    data.clientVersion,
    data.clientMetaData,
    data.remoteHost
  )
}

export function toChatInfo(data: ChatInfoData): ChatInfo {
  return new ChatInfo(
    data.chatId,
    data.chatType,
    data.membership,
    data.name,
    data.topic,
    (data.members || []).map((m: DomainUserIdData) => toDomainUserId(m)),
    new Date(data.created),
    data.lastEventNumber,
    new Date(data.lastEventTimestamp)
  );
}

export function toChatEvent(event: any): ChatEvent {
  switch (event.type) {
    case "created":
      const members = event.members || [];
      return new ChatCreatedEvent(
        event.eventNumber,
        event.id,
        toDomainUserId(event.user),
        new Date(event.timestamp),
        event.name,
        event.topic,
        members.map((m: DomainUserIdData) => toDomainUserId(m)));
    case "message":
      return new ChatMessageEvent(
        event.eventNumber,
        event.id,
        toDomainUserId(event.user),
        new Date(event.timestamp),
        event.message);
    case "user_joined":
      return new ChatUserJoinedEvent(
        event.eventNumber,
        event.id,
        toDomainUserId(event.user),
        new Date(event.timestamp));
    case "user_left":
      return new ChatUserLeftEvent(
        event.eventNumber,
        event.id,
        toDomainUserId(event.user),
        new Date(event.timestamp));
    case "user_added":
      return new ChatUserAddedEvent(
        event.eventNumber,
        event.id,
        toDomainUserId(event.user),
        new Date(event.timestamp),
        toDomainUserId(event.userAdded));
    case "user_removed":
      return new ChatUserRemovedEvent(
        event.eventNumber,
        event.id,
        toDomainUserId(event.user),
        new Date(event.timestamp),
        toDomainUserId(event.userRemoved));
    case "name_changed":
      return new ChatNameChangedEvent(
        event.eventNumber,
        event.id,
        toDomainUserId(event.user),
        new Date(event.timestamp),
        event.name);
    case "topic_changed":
      return new ChatTopicChangedEvent(
        event.eventNumber,
        event.id,
        toDomainUserId(event.user),
        new Date(event.timestamp),
        event.topic);
    default:
      throw new ConvergenceError(`Invalid chat event type: ${event.type}`);
  }
}

export function toActivityInfo(data: ActivityData): ActivityInfo {
  return new ActivityInfo(
    data.activityType,
    data.activityId,
    data.ephemeral,
    new Date(data.created)
  );
}
