
/* IMPORT */

import createAbstractServer from '~/servers/abstract';
import {noop} from '~/utils';
import type {IProcedures, IMemoryServerOptions, IMemoryServer} from '~/types';

/* MAIN */

const createMemoryServer = <T extends IProcedures> ( options: IMemoryServerOptions<T> ): IMemoryServer => {

  const {procedures} = options;

  return createAbstractServer<T> ({
    procedures,
    handler: noop
  });

};

/* EXPORT */

export default createMemoryServer;
