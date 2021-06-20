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

import moment from "moment";
import {DomainUserId, DomainUserType} from "@convergence/convergence";
import {DomainStatus} from "../models/DomainStatus";
import {DomainAvailability} from "../models/DomainAvailability";

export function shortDateTime(time: Date | number): string {
  return moment(time).format("MM/DD @ hh:mma")
}

export function longDateTime(time: Date | number): string {
  return moment(time).format("MM/DD/YYYY @ hh:mma")
}

export function longDateTimeWithSeconds(time: Date | number): string {
  return moment(time).format("MM/DD/YYYY @ hh:mm:ssa")
}

export function durationToNow(date: Date): string {
  const now = moment();
  const then = moment(date);

  const days = now.diff(then, "days");
  if (days > 0) {
    return days + " days";
  }

  const hours = now.diff(then, "hours");
  if (hours > 0) {
    return hours + " hours";
  }

  const minutes = now.diff(then, "minutes");
  if (minutes > 0) {
    return minutes + " minutes";
  }

  const seconds = now.diff(then, "seconds");
  return seconds + " seconds";
}

export function yesNo(value: boolean, lowerCase: boolean = false): string {
  const yn = value ? "Yes" : "No";

  if (lowerCase) {
    return yn.toLowerCase()
  } else {
    return yn;
  }
}

export function truncate(str: string, maxLen: number): string {
  if (str.length + 3 > maxLen) {
    return str.substring(0, maxLen - 3) + "...";
  } else {
    return str;
  }
}

export function formatDomainUserId(userId: DomainUserId): string {
  switch (userId.userType) {
    case DomainUserType.NORMAL:
    return userId.username;
    case DomainUserType.ANONYMOUS:
      return `${userId.username} (Anonymous)`;
    case DomainUserType.CONVERGENCE:
      return `${userId.username} (Convergence)`;
  }
}

export function formatKBytes(kb: number, decimals: number) {
  return formatBytes(kb * 1000, decimals);
}

export function formatBytes(bytes: number, decimals: number) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  let k = 1000;
  let dm = decimals + 1 || 3;
  let sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDomainStatus(status: DomainStatus): string {
  switch (status) {
    case DomainStatus.ERROR:
      return "Error";
    case DomainStatus.INITIALIZING:
      return "Initializing";
    case DomainStatus.DELETING:
      return "Deleting";
    case DomainStatus.READY:
      return "Ready";
    case DomainStatus.SCHEMA_UPGRADE_REQUIRED:
      return "Schema Upgrade Required";
    case DomainStatus.SCHEMA_UPGRADING:
      return "Schema Upgrading";
    default:
      throw new Error("Unknown domain status: " + status);
  }
}

export function formatDomainAvailability(availability: DomainAvailability): string {
  switch (availability) {
    case DomainAvailability.ONLINE:
      return "Online";
    case DomainAvailability.OFFLINE:
      return "Offline";
    case DomainAvailability.MAINTENANCE:
      return "Maintenance";
    default:
      throw new Error("Unknown domain availability: " + availability);
  }
}