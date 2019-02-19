import {ModelElement, ModelElementMutationEvent} from "./ModelElement";
import {ModelElementTypes} from "./ModelElementTypes";
import {ContainerElement} from "./ContainterElement";

export class NumberValueEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "value";
  public readonly name: string = NumberValueEvent.NAME;
  constructor(public readonly element: NumberElement,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export class NumberDeltaEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "delta";
  public readonly name: string = NumberDeltaEvent.NAME;
  constructor(public readonly element: NumberElement,
              public readonly delta: number,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export abstract class NumberElement extends ModelElement<number> {
  constructor(id: string, parent: ContainerElement<any>) {
    super(id, parent);
  }

  public type(): string {
    return ModelElementTypes.NUMBER;
  }

  public abstract delta(delta: number): void;

  protected _emitDelta(delta: number, remote: boolean = false): void {
    this._emit(new NumberDeltaEvent(this, delta, remote));
    this._bubbleChange(remote);
  }

  protected _emitValue(remote: boolean = false): void {
    this._emit(new NumberValueEvent(this, remote));
    this._bubbleChange(remote);
  }
}
