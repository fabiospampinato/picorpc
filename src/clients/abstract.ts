
/* IMPORT */

import {VERSION} from '~/constants';
import Request from '~/objects/request';
import {isFunction, isString} from '~/utils';
import type {IProcedures, IAbstractClientOptions, IAbstractClient} from '~/types';

/* MAIN */

const createAbstractClient = <T extends IProcedures> ( options: IAbstractClientOptions ): IAbstractClient<T> => {

  const {context, handler} = options;

  let client = Object.seal ( Object.freeze ( {} ) ) as IAbstractClient<T>; //TSC
  let id = 0n;

  return new Proxy ( client, {

    get: ( _, method: string | symbol ) => {

      if ( !isString ( method ) ) throw new Error ( 'Invalid method' );

      return ( ...params: unknown[] ) => {

        return new Request ( handler, {
          version: VERSION,
          id: String ( id += 1n ),
          method,
          params,
          context: isFunction ( context ) ? context () : undefined
        });

      };

    }

  });

};

/* EXPORT */

export default createAbstractClient;
