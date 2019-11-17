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

import {Observable, Subject} from "rxjs";
import {SapphireEvent} from "../../SapphireEvent";
import {ModelElement} from "../../model/ModelElement";
import {ObjectElement} from "../../model/ObjectElement";
import {ModelSubtreeChangedEvent} from "../../model/ContainterElement";

export interface PathControlModelEvents {
  readonly SELECTION_CHANGED: string;
}

export class PathElementSelectionEvent implements SapphireEvent {
  public static NAME: string = "selection_changed";
  public name: string = PathElementSelectionEvent.NAME;

  constructor(public pathControlModel: PathControlModel,
              public element: ModelElement<any> | null) {
    Object.freeze(this);
  }
}

export class PathSelectedElementUpdatedEvent implements SapphireEvent {
  public static NAME: string = "path_updated";
  public name: string = PathSelectedElementUpdatedEvent.NAME;

  constructor(public pathControlModel: PathControlModel) {
    Object.freeze(this);
  }
}

export class PathControlModel {

  public static readonly Events: PathControlModelEvents = {
    SELECTION_CHANGED: PathElementSelectionEvent.NAME
  };

  private _eventsSubject: Subject<SapphireEvent>;
  private readonly _rootLabel: string;
  private _selectedElement: ModelElement<any> | null;

  constructor(rootLabel: string, rootElement: ObjectElement, selectedElement: ModelElement<any>) {
    this._eventsSubject = new Subject<SapphireEvent>();
    this._rootLabel = rootLabel;
    this._selectedElement = selectedElement;

    rootElement.events().subscribe(e => {
      if (e instanceof ModelSubtreeChangedEvent) {

        // FIXME we should be testing if the thing that changed is an ancestor.
        this._eventsSubject.next(new PathSelectedElementUpdatedEvent(this))
      }
    });
  }

  setSelectedElement(selectedElement: ModelElement<any> | null): void {
    if (this._selectedElement !== selectedElement) {
      this._selectedElement = selectedElement;
      const event: PathElementSelectionEvent = new PathElementSelectionEvent(this, selectedElement);
      this._eventsSubject.next(event);
    }
  }

  getSelectedElement(): ModelElement<any> | null {
    return this._selectedElement;
  }

  getRootLabel(): string {
    return this._rootLabel;
  }

  events(): Observable<SapphireEvent> {
    return this._eventsSubject.asObservable();
  }
}
