
/* IMPORT */

import createAbstractServer from '~/servers/abstract';
import {identity} from '~/utils';
import type {IProcedures, IMemoryServerOptions, IMemoryServer} from '~/types';

/* MAIN */

const createMemoryServer = <T extends IProcedures> ( options: IMemoryServerOptions<T> ): IMemoryServer => {

  const {procedures} = options;

  return createAbstractServer<T> ({
    procedures,
    handler: identity
  });

};

/* EXPORT */

export default createMemoryServer;
