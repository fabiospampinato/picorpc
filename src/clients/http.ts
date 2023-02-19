
/* IMPORT */

import createAbstractClient from '~/clients/abstract';
import {deserialize, serialize} from '~/json';
import type {IProcedures, IHttpClientOptions, IHttpClient} from '~/types';

/* MAIN */

const createHttpClient = <T extends IProcedures> ( options: IHttpClientOptions ): IHttpClient<T> => {

  const {context, url} = options;
  const serializer = options.serializer || serialize;
  const deserializer = options.deserializer || deserialize;

  return createAbstractClient<T> ({
    context,
    handler: async request => {
      const response = await fetch ( url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
