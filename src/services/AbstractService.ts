import superagent, {Response, SuperAgentRequest} from 'superagent';

export abstract class AbstractService {
  private readonly _baseUrl: string;

  protected constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  protected async _get(relPath: string): Promise<any> {
    const path = this._computePath(relPath);
    await superagent
      .get(path)
      .use(this._authPlugin)
      .end(this._handleErrors)
      .then(this._responseBody);
  }

  protected async _put(relPath: string, params: { [key: string]: any }): Promise<any> {
    const path = this._computePath(relPath);
    await superagent
      .put(path)
      .send(params)
      .use(this._authPlugin)
      .end(this._handleErrors)
      .then(this._responseBody);
  }

  protected async _post(relPath: string, params: { [key: string]: any }): Promise<any> {
    const path = this._computePath(relPath);
    await superagent
      .post(path)
      .send(params)
      .use(this._authPlugin)
      .end(this._handleErrors)
      .then(this._responseBody);
  }

  protected async _delete(relPath: string): Promise<any> {
    const path = this._computePath(relPath);
    await superagent
      .delete(path)
      .use(this._authPlugin)
      .end(this._handleErrors)
      .then(this._responseBody);
  }

  private _computePath(relPath: string): string {
    return `${this._baseUrl}/${relPath}`;
  }

  private _responseBody = (res: Response) => res.body;

  private _authPlugin = (req: SuperAgentRequest) => {
    const token = '';
    if (token) {
      req.set('authorization', `Token ${token}`);
    }
  };

  private _handleErrors = (err: any) => {
    return this._processErrors(err);
  };

  protected _processErrors(err: any) {
    return err;
  }
}