/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class ChatInfo {
  constructor(public readonly chatId: string,
              public readonly type: string,
              public readonly membership: string,
              public readonly name: string,
              public readonly topic: string,
              public readonly members: string[]
  ) {
    Object.freeze(this);
  }
}
