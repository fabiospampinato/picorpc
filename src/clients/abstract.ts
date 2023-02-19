
/* IMPORT */

import {VERSION} from '~/constants';
import Request from '~/objects/request';
import Requests from '~/objects/requests';
import {isString} from '~/utils';
import type {IProcedures, IAbstractClientOptions, IAbstractClient} from '~/types';

/* MAIN */

const createAbstractClient = <T extends IProcedures> ( options: IAbstractClientOptions ): IAbstractClient<T> => {

  const {handler} = options;

  let client = Object.seal ( Object.freeze ( {} ) ) as IAbstractClient<T>; //TSC
  let count = 0;

  return new Proxy ( client, {

    get: ( _, method: string | symbol ) => {

      if ( !isString ( method ) ) throw new Error ( 'Invalid method' );

      if ( method === 'batch' ) {

        return ( requests: Request[] ) => {

          return new Requests ( handler, requests );

        };

      } else {

        return ( ...params: unknown[] ) => {

          return new Request ( handler, {
            version: VERSION,
            id: String ( count += 1 ),
            method,
            params
          });

        };

      }

    }

  });

};

/* EXPORT */

export default createAbstractClient;
