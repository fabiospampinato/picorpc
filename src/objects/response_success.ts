
/* IMPORT */

import {VERSION} from '~/constants';
import Response from '~/objects/response';
import type {IResponseHandler} from '~/types';

/* MAIN */

class ResponseSuccess extends Response {

  /* CONSTRUCTOR */

  constructor ( handler: IResponseHandler, id: string, result: unknown ) {

    super ( handler, {
      version: VERSION,
      id,
      result
    });

  }

}

/* EXPORT */

export default ResponseSuccess;
