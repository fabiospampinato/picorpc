
/* IMPORT */

import {ERROR_CODE_FAILED_PROCEDURE_EXEC, ERROR_MESS_FAILED_PROCEDURE_EXEC} from '~/constants';
import Error from '~/objects/error';
import {identity} from '~/utils';
import type {IRequest, IRequestHandler} from '~/types';

/* MAIN */

class Request<T> {

  /* VARIABLES */

  protected handler: IRequestHandler;
  protected request: IRequest;

  /* CONSTRUCTOR */

  constructor ( handler: IRequestHandler, request: IRequest ) {

    this.handler = handler;
    this.request = request;

  }

  /* API */

  exec (): void {

    this.then ();

  }

  then ( onSuccess: ( result: T ) => T = identity ): Promise<T> {

    return this.handler ( this.request ).then ( response => response.valueOf () ).then ( response => {

      if ( 'error' in response ) { // Error response

        const code = response.error.code || ERROR_CODE_FAILED_PROCEDURE_EXEC;
        const message = response.error.message || ERROR_MESS_FAILED_PROCEDURE_EXEC;
        const data = response.error.data;
        const error = new Error ( code, message, data );

        throw error;

      } else { // Success response

        return response.result as T; //TSC

      }

    }).then ( onSuccess );

  }

  valueOf (): IRequest {

    return this.request;

  }

}

/* EXPORT */

export default Request;
