
/* IMPORT */

import {VERSION} from '~/constants';
import Response from '~/objects/response';
import type {IResponseHandler} from '~/types';

/* MAIN */

class ResponseError extends Response {

  /* CONSTRUCTOR */

  constructor ( handler: IResponseHandler, id: string, code: number, message: string, data?: unknown ) {

    super ( handler, {
      version: VERSION,
      id,
      error: {
        code,
        message,
        data
      }
    });

  }

}

/* EXPORT */

export default ResponseError;
