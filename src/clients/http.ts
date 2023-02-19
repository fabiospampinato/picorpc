
/* IMPORT */

import createAbstractClient from '~/clients/abstract';
import type {IProcedures, IHttpClientOptions, IHttpClient} from '~/types';

/* MAIN */

const createHttpClient = <T extends IProcedures> ( options: IHttpClientOptions ): IHttpClient<T> => {

  const {url} = options;
  const serializer = options.serializer || JSON.stringify;
  const deserializer = options.deserializer || JSON.parse;

  return createAbstractClient<T> ({
    handler: async request => {
      const response = await fetch ( url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: serializer ( request )
      });
      const content = await response.text ();
      const result = deserializer ( content );
      return result;
    }
  });

};

/* EXPORT */

export default createHttpClient;
