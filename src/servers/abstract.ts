
/* IMPORT */

import {ERROR_CODE_INVALID_REQUEST, ERROR_MESS_INVALID_REQUEST} from '~/constants';
import {ERROR_CODE_INVALID_VERSION, ERROR_MESS_INVALID_VERSION} from '~/constants';
import {ERROR_CODE_UNSUPPORTED_VERSION, ERROR_MESS_UNSUPPORTED_VERSION} from '~/constants';
import {ERROR_CODE_INVALID_ID, ERROR_MESS_INVALID_ID} from '~/constants';
import {ERROR_CODE_INVALID_PROCEDURE_NAME, ERROR_MESS_INVALID_PROCEDURE_NAME} from '~/constants';
import {ERROR_CODE_INVALID_PROCEDURE_PARAMS, ERROR_MESS_INVALID_PROCEDURE_PARAMS} from '~/constants';
import {ERROR_CODE_FAILED_PROCEDURE_EXEC, ERROR_MESS_FAILED_PROCEDURE_EXEC} from '~/constants';
import {FALLBACK_RESPONSE_ID} from '~/constants';
import {VERSION} from '~/constants';

import ResponseError from '~/objects/response_error';
import ResponseSuccess from '~/objects/response_success';

import {castError, isInteger, isObject, isString, isUndefined, isVersionCompatible} from '~/utils';

import type Response from '~/objects/response';
import type {IProcedures, IAbstractServerOptions, IAbstractServer} from '~/types';
import type {IRequest} from '~/types';

/* MAIN */

const createAbstractServer = <T extends IProcedures> ( options: IAbstractServerOptions<T> ): IAbstractServer => {

  const {procedures, handler} = options;

  return {

    handle: async ( request: IRequest ): Promise<Response> => {

      if ( !isObject ( request ) ) return new ResponseError ( handler, FALLBACK_RESPONSE_ID, ERROR_CODE_INVALID_REQUEST, ERROR_MESS_INVALID_REQUEST );

      if ( !isString ( request.id ) ) return new ResponseError ( handler, FALLBACK_RESPONSE_ID, ERROR_CODE_INVALID_ID, ERROR_MESS_INVALID_ID );

      if ( !isString ( request.version ) ) return new ResponseError ( handler, request.id, ERROR_CODE_INVALID_VERSION, ERROR_MESS_INVALID_VERSION );

      if ( !isVersionCompatible ( request.version, VERSION ) ) return new ResponseError ( handler, request.id, ERROR_CODE_UNSUPPORTED_VERSION, ERROR_MESS_UNSUPPORTED_VERSION );

      if ( !isString ( request.method ) || !procedures.hasOwnProperty ( request.method ) ) return new ResponseError ( handler, request.id, ERROR_CODE_INVALID_PROCEDURE_NAME, ERROR_MESS_INVALID_PROCEDURE_NAME );

      if ( !Array.isArray ( request.params ) && !isUndefined ( request.params ) ) return new ResponseError ( handler, request.id, ERROR_CODE_INVALID_PROCEDURE_PARAMS, ERROR_MESS_INVALID_PROCEDURE_PARAMS );

      try {

        const id = request.id;
        const method = request.method;
        const params = request.params || [];
        const result = await procedures[method]( ...params );

        return new ResponseSuccess ( handler, id, result );

      } catch ( exception: unknown ) {

        const id = request.id;
        const error = castError ( exception );
        const code = isInteger ( error.code ) && ( error.code >= 0 ) ? error.code : ERROR_CODE_FAILED_PROCEDURE_EXEC;
        const message = isString ( error.message ) ? error.message : ERROR_MESS_FAILED_PROCEDURE_EXEC;
        const data = error.data;

        return new ResponseError ( handler, id, code, message, data );

      }

    }

  };

};

/* EXPORT */

export default createAbstractServer;
