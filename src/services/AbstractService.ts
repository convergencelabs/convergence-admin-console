import superagent, {Response, SuperAgentRequest} from 'superagent';
import {CONFIG} from "../constants";
import {RestError} from "./RestError";

export abstract class AbstractService {

  protected async _get<T>(relPath: string): Promise<T> {
    const path = this._computePath(relPath);
    return await superagent
      .get(path)
      .use(this._preProcessRequest)
      .catch(this._processErrors)
      .then(this._processResponse);
  }

  protected async _put<T>(relPath: string, params: { [key: string]: any }): Promise<T> {
    const path = this._computePath(relPath);
    return await superagent
      .put(path)
      .send(params)
      .use(this._preProcessRequest)
      .catch(this._processErrors)
      .then(this._processResponse);
  }

  protected async _post<T>(relPath: string, params: { [key: string]: any }): Promise<T> {
    const path = this._computePath(relPath);
    return await superagent
      .post(path)
      .send(params)
      .use(this._preProcessRequest)
      .catch(this._processErrors)
      .then(this._processResponse);
  }

  protected async _delete<T>(relPath: string): Promise<T> {
    const path = this._computePath(relPath);
    return await superagent
      .delete(path)
      .use(this._preProcessRequest)
      .catch(this._processErrors)
      .then(this._processResponse);
  }

  private _computePath(relPath: string): string {
    return `${CONFIG.convergenceRestApiUrl}/${relPath}`;
  }

  private _processResponse = (res: Response) => {
    const body = res.body;
    if (body.ok) {
      return Promise.resolve(body.body)
    } else {
      const {error_message, error_code, error_details} = body.body;
      return Promise.reject(new RestError(error_message, error_code, error_details));
    }
  }

  protected _processErrors(err: any): any {
    return Promise.reject(err);
  }
  
  protected _preProcessRequest(req: SuperAgentRequest): void {
    
  }
}