import {ModelElement, ModelElementMutationEvent} from "./ModelElement";
import {ModelElementTypes} from "./ModelElementTypes";
import {ContainerElement} from "./ContainterElement";

export class ArraySetEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "set";
  public readonly name: string = ArraySetEvent.NAME;

  constructor(public readonly element: ArrayElement,
              public readonly index: number,
              public readonly value: ModelElement<any>,
              public readonly  remote: boolean) {
    Object.freeze(this);
  }
}

export class ArrayInsertEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "insert";
  public readonly name: string = ArrayInsertEvent.NAME;

  constructor(public readonly element: ArrayElement,
              public readonly index: number,
              public readonly value: ModelElement<any>,
              public readonly  remote: boolean) {
    Object.freeze(this);
  }
}

export class ArrayRemoveEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "remove";
  public readonly name: string = ArrayRemoveEvent.NAME;

  constructor(public readonly element: ArrayElement,
              public readonly index: number,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export class ArrayReorderEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "reorder";
  public readonly name: string = ArrayReorderEvent.NAME;

  constructor(public readonly element: ArrayElement,
              public readonly from: number,
              public readonly to: number,
              public readonly  remote: boolean) {
    Object.freeze(this);
  }
}

export class ArrayValueEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "reorder";
  public readonly name: string = ArrayReorderEvent.NAME;

  constructor(public readonly element: ArrayElement,
              public readonly from: number,
              public readonly to: number,
              public readonly  remote: boolean) {
    Object.freeze(this);
  }
}

export class ArrayElementValueEvent implements ModelElementMutationEvent {
  public static NAME: string = "value";
  public name: string = ArrayElementValueEvent.NAME;

  constructor(public readonly element: ArrayElement,
              public readonly  remote: boolean) {
    Object.freeze(this);
  }
}

export abstract class ArrayElement extends ContainerElement<any[]> {

  protected constructor(id: string, parent: ContainerElement<any>) {
    super(id, parent);
  }

  public type(): string {
    return ModelElementTypes.ARRAY;
  }

  protected _emitSet(index: number, value: ModelElement<any>, remote: boolean = false): void {
    this._emit(new ArraySetEvent(this, index, value, remote));
    this._bubbleChange(remote);
  }

  protected _emitInsert(index: number, value: ModelElement<any>, remote: boolean = false): void {
    this._emit(new ArrayInsertEvent(this, index, value, remote));
    this._bubbleChange(remote);
  }

  protected _emitRemove(index: number, remote: boolean = false): void {
    this._emit(new ArrayRemoveEvent(this, index, remote));
    this._bubbleChange(remote);
  }

  protected _emitReorder(from: number, to: number, remote: boolean = false): void {
    this._emit(new ArrayReorderEvent(this, from, to, remote));
    this._bubbleChange(remote);
  }

  protected _emitValue(remote: boolean = false): void {
    this._emit(new ArrayElementValueEvent(this, remote));
    this._bubbleChange(remote);
  }


  public abstract insert(index: number, value: any): void

  public abstract set(index: number, value: any): void;

  public abstract remove(index: number): void;

  public abstract reorder(fromIndex: number, toIndex: number): void;

  public abstract forEach(callback: (index: number, value: ModelElement<any>) => void): void;

  public abstract size(): number;
}
