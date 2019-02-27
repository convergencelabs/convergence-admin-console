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
