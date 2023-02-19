
/* IMPORT */

import {Buffer} from 'node:buffer';
import http from 'node:http';
import createAbstractServer from '~/servers/abstract';
import {attempt, identity, isArray} from '~/utils';
import type {IProcedures, IHttpServerOptions, IHttpServer} from '~/types';

/* MAIN */

const createHttpServer = <T extends IProcedures> ( options: IHttpServerOptions<T> ): IHttpServer => {

  const {port, procedures} = options;
  const serializer = options.serializer || JSON.stringify;
  const deserializer = options.deserializer || JSON.parse;

  /* MEMORY SERVER */

  const memoryServer = createAbstractServer<T> ({
    procedures,
    handler: identity
  });

  /* HTTP SERVER */

  //TODO: Make this more robust, even though it isn't meant to interface with the internet directly

  const httpServer = http.createServer ( ( request, response ) => {
    const chunks: Buffer[] = [];
    request.on ( 'data', chunk => {
      chunks.push ( chunk );
    });
    request.on ( 'end', async () => {
      const body = Buffer.concat ( chunks ).toString ();
      const requests = attempt ( () => deserializer ( body ), [] );
      const responses = await memoryServer.handle ( requests );
      const responsesSerialized = isArray ( responses ) ? responses.map ( response => serializer ( response.valueOf () ) ) : serializer ( responses.valueOf () );
      response.statusCode = 200;
      response.setHeader ( 'Content-Type', 'application/json' );
      response.write ( responsesSerialized );
      response.end ();
    });
  }).listen ( port );

  const close = () => {
    httpServer.close ();
  };

  /* RETURN */

  return { ...memoryServer, close };

};

/* EXPORT */

export default createHttpServer;
