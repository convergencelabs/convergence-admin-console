/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import superagent, {Response, SuperAgentRequest} from 'superagent';
import {RestError} from "./RestError";
import {AppConfig} from "../stores/AppConfig";

export abstract class AbstractService {

  protected async _get<T>(relPath: string, params: any = {}): Promise<T> {
    const path = this._computePath(relPath);
    return await superagent
      .get(path)
      .query(params)
      .use(this._preProcessRequest)
      .ok(res => res.status < 500)
      .then(this._processResponse);
  }

  protected async _put<T>(relPath: string, entity?: { [key: string]: any }): Promise<T> {
    const path = this._computePath(relPath);
    return await superagent
      .put(path)
      .send(entity)
      .use(this._preProcessRequest)
      .ok(res => res.status < 500)
      .then(this._processResponse);
  }

  protected async _post<T>(relPath: string, entity?: { [key: string]: any }): Promise<T> {
    const path = this._computePath(relPath);
    return await superagent
      .post(path)
      .send(entity)
      .use(this._preProcessRequest)
      .ok(res => res.status < 500)
      .then(this._processResponse);
  }

  protected async _delete<T>(relPath: string): Promise<T> {
    const path = this._computePath(relPath);
    return await superagent
      .delete(path)
      .use(this._preProcessRequest)
      .ok(res => res.status < 500)
      .then(this._processResponse);
  }

  private _computePath(relPath: string): string {
    return `${AppConfig.restApiUrl}${relPath}`;
  }

  protected _processResponse(httpResponse: Response) {
    const body = httpResponse.body;
    if (body === null) {
      return Promise.reject(new Error("The response from the server had no body."));
    } else if (body.ok) {
      return Promise.resolve(body.body)
    } else {
      if (body.body) {
        const {error_message, error_code, error_details} = body.body;
        return Promise.reject(new RestError(error_message, error_code, error_details));
      } else {
        return Promise.reject(httpResponse);
      }
    }
  }

  protected _preProcessRequest(req: SuperAgentRequest): void {

  }

  protected _filterParams(params: {[key: string]: any}, exludedValues: any[]): any {
    const result: {[key: string]: any} = {};
    Object.keys(params).forEach((key: string) => {
      const value = params[key];
      if (value !== undefined && !exludedValues.includes(value)) {
        result[key] = value;
      }
    });
    return result;
  }
}