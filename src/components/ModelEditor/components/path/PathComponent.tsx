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

import React, {ReactNode} from 'react';
import {RootElement} from './RootElement';
import {PropertyElement} from './PropertyElement';
import {IndexElement} from './IndexElement';
import {ModelElement} from "../../model/ModelElement";
import {PathControlModel, PathElementSelectionEvent, PathSelectedElementUpdatedEvent} from "./PathControlModel";
import {Subscription} from "rxjs";
import {SapphireEvent} from "../../SapphireEvent";

export interface PathComponentProps {
  model: PathControlModel;
}

export interface PathComponentState {
  element: ModelElement<any> | null;
}

export type PathClickCallback = (element: ModelElement<any>) => void;

export class PathComponent extends React.Component<PathComponentProps, PathComponentState> {

  private _modelSubscription: Subscription | null;

  constructor(props: PathComponentProps, context?: any) {
    super(props, context);
    this.state = {element: this.props.model.getSelectedElement()};
    this._onSegmentClick = this._onSegmentClick.bind(this);
    this._modelSubscription = null;
  }

  public componentDidMount(): void {
    this._registerModel();
  }

  componentDidUpdate(prevProps: PathComponentProps, prevState: PathComponentState): void {
    if (this.props.model !== prevProps.model) {
      this._unregisterModel();
      this._registerModel();
    }
  }

  public componentWillUnmount(): void {
    this._unregisterModel();
  }

  private _onSegmentClick(modelElement: ModelElement<any>): void {
    this.props.model.setSelectedElement(modelElement);
  }

  private _registerModel(): void {
    this._modelSubscription = this.props.model.events()
      .subscribe((e: SapphireEvent) => {
        if (e instanceof PathElementSelectionEvent) {
          this.setState({element: e.element});
        } else if (e instanceof PathSelectedElementUpdatedEvent) {
          this.forceUpdate();
        }
      });
  }

  private _unregisterModel(): void {
    if (this._modelSubscription !== null) {
      this._modelSubscription.unsubscribe();
      this._modelSubscription = null;
    }
  }

  public render(): ReactNode {
    const segments = [];
    if (this.state.element) {
      const path: Array<ModelElement<any>> = this.state.element.elementPath();

      segments.push(<RootElement key={0}
                                 onSegmentClick={this._onSegmentClick}
                                 element={path[0]}
                                 label={this.props.model.getRootLabel()}/>);


      for (let i = 1; i < path.length; i++) {
        const element: ModelElement<any> = path[i];
        segments.push(
          <span key={i}>
          {
            typeof element.relativePathFromParent() == "string" ?
              <PropertyElement element={element} onClick={this._onSegmentClick}/> :
              <IndexElement element={element} onClick={this._onSegmentClick}/>
          }
        </span>
        )
      }
    }

    return <div className="path-control">{segments}</div>;
  }
}
