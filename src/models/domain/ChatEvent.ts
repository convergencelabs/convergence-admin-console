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

import {DomainUserId} from "@convergence/convergence";

export interface ChatEvent {
  readonly type: "created" | "message" | "user_joined" | "user_left" | "user_added" | "user_removed" | "name_changed" | "topic_changed";
  readonly eventNumber: number;
  readonly id: string;
  readonly userId: DomainUserId;
  readonly timestamp: Date;

}

export class ChatCreatedEvent implements ChatEvent {
  public type: "created" = "created";

  constructor(public readonly eventNumber: number,
              public readonly id: string,
              public readonly userId: DomainUserId,
              public readonly timestamp: Date,
              public readonly name: string,
              public readonly topic: string,
              public readonly members: Set<DomainUserId>

  ) {
    Object.freeze(this);
  }
}

export class ChatMessageEvent implements ChatEvent {
  public type: "message" = "message";

  constructor(public readonly eventNumber: number,
              public readonly id: string,
              public readonly userId: DomainUserId,
              public readonly timestamp: Date,
              public readonly message: string
  ) {
    Object.freeze(this);
  }
}

export class ChatUserJoinedEvent implements ChatEvent {

  public type: "user_joined" = "user_joined";

  constructor(public readonly eventNumber: number,
              public readonly id: string,
              public readonly userId: DomainUserId,
              public readonly timestamp: Date
  ) {
    Object.freeze(this);
  }
}

export class ChatUserLeftEvent implements ChatEvent {
  public type: "user_left" = "user_left";

  constructor(public readonly eventNumber: number,
              public readonly id: string,
              public readonly userId: DomainUserId,
              public readonly timestamp: Date
  ) {
    Object.freeze(this);
  }
}

export class ChatUserAddedEvent implements ChatEvent {
  public type: "user_added" = "user_added";

  constructor(public readonly eventNumber: number,
              public readonly id: string,
              public readonly userId: DomainUserId,
              public readonly timestamp: Date,
              public readonly addedUserId: DomainUserId,
  ) {
    Object.freeze(this);
  }
}

export class ChatUserRemovedEvent implements ChatEvent {
  public type: "user_removed" = "user_removed";

  constructor(public readonly eventNumber: number,
              public readonly id: string,
              public readonly userId: DomainUserId,
              public readonly timestamp: Date,
              public readonly removedUserId: DomainUserId,
  ) {
    Object.freeze(this);
  }
}


export class ChatNameChangedEvent implements ChatEvent {
  public type: "name_changed" = "name_changed";

  constructor(public readonly eventNumber: number,
              public readonly id: string,
              public readonly userId: DomainUserId,
              public readonly timestamp: Date,
              public readonly name: string
  ) {
    Object.freeze(this);
  }
}

export class ChatTopicChangedEvent implements ChatEvent {
  public type: "topic_changed" = "topic_changed";

  constructor(public readonly eventNumber: number,
              public readonly id: string,
              public readonly userId: DomainUserId,
              public readonly timestamp: Date,
              public readonly topic: string
  ) {
    Object.freeze(this);
  }
}
