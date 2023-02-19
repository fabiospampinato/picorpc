
/* IMPORT */

import {Buffer} from 'node:buffer';
import http from 'node:http';
import {deserialize, serialize} from '~/json';
import createAbstractServer from '~/servers/abstract';
import {attempt, noop} from '~/utils';
import type {IProcedures, IHttpServerOptions, IHttpServer} from '~/types';

/* MAIN */

const createHttpServer = <T extends IProcedures> ( options: IHttpServerOptions<T> ): IHttpServer => {

  const {port, procedures} = options;
  const serializer = options.serializer || serialize;
  const deserializer = options.deserializer || deserialize;

  /* MEMORY SERVER */

  const memoryServer = createAbstractServer<T> ({
    procedures,
    handler: noop
  });

  /* HTTP SERVER */

  //TODO: Make this more robust, even though it isn't meant to interface with the internet directly
  //TODO: Make this more configurable, maybe
  //TODO: Maybe return a different status code if the response is an error, I'm not sure

  const httpServer = http.createServer ( ( req, res ) => {
    const chunks: Buffer[] = [];
    req.on ( 'data', chunk => {
      chunks.push ( chunk );
    });
    req.on ( 'end', async () => {
      const body = Buffer.concat ( chunks ).toString ();
      const request = attempt ( () => deserializer ( body ), {} );
      const response = await memoryServer.handle ( request );
      const responseSerialized = serializer ( response.valueOf () );
      res.statusCode = 200;
      res.setHeader ( 'Content-Type', 'application/json' );
      res.write ( responseSerialized );
      res.end ();
    });
  });

  httpServer.listen ( port );

  /* RETURN */

  return {
    ...memoryServer,
    close: () => {
      httpServer.close ();
    }
  };

};

/* EXPORT */

export default createHttpServer;
