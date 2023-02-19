
/* IMPORT */

import type {IResponse, IResponseHandler} from '~/types';

/* MAIN */

class Response {

  /* VARIABLE */

  private handler: IResponseHandler
  private response: IResponse;

  /* CONSTRUCTOR */

  constructor ( handler: IResponseHandler, response: IResponse ) {

    this.handler = handler;
    this.response = response;

  }

  /* API */

  exec (): void {

    this.handler ( this.response );

  }

  valueOf (): IResponse {

    return this.response;

  }

}

/* EXPORT */

export default Response;
