export class RestError extends Error {
  constructor(message: string, public code: string, public details: {[key: string]: any}) {
    super(message);

    this.name = 'RestError';

    if (this.details === undefined) {
      this.details = {};
    }

    Object.setPrototypeOf(this, RestError.prototype);
  }
}