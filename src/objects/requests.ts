
/* IMPORT */

import {ERROR_CODE_FAILED_PROCEDURE_EXEC, ERROR_MESS_FAILED_PROCEDURE_EXEC} from '~/constants';
import Error from '~/objects/error';
import {identity, isArray} from '~/utils';
import type {IRequest, IRequestsHandler} from '~/types';

/* MAIN */

class Requests<T> {

  /* VARIABLES */

  private handler: IRequestsHandler;
  private requests: IRequest[];

  /* CONSTRUCTOR */

  constructor ( handler: IRequestsHandler, requests: IRequest[] ) {

    this.handler = handler;
    this.requests = requests;

  }

  /* API */

  exec (): void {

    this.then ();

  }

  then ( onSuccess: ( result: T ) => T = identity ): Promise<T> {

    return this.handler ( this.requests ).then ( response => isArray ( response ) ? response.map ( response => response.valueOf () ) : response.valueOf ).then ( responses => {

      if ( isArray ( responses ) ) {

        return response.result as T; //TSC

      } else {

      }

      if ( 'error' in response ) { // Error response

        const code = response.error.code || ERROR_CODE_FAILED_PROCEDURE_EXEC;
        const message = response.error.message || ERROR_MESS_FAILED_PROCEDURE_EXEC;
        const data = response.error.data;
        const error = new Error ( code, message, data );

        throw error;

      } else { // Success response



      }

    }).then ( onSuccess );

  }

  valueOf (): IRequest[] {

    return this.requests;

  }

}

/* EXPORT */

export default Requests;
