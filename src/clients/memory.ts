
/* IMPORT */

import createAbstractClient from '~/clients/abstract';
import type {IProcedures, IMemoryClientOptions, IMemoryClient} from '~/types';

/* MAIN */

const createMemoryClient = <T extends IProcedures> ( options: IMemoryClientOptions ): IMemoryClient<T> => {

  const {server} = options;

  return createAbstractClient<T> ({
    handler: server.handle
  });

};

/* EXPORT */

export default createMemoryClient;
