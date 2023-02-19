
/* IMPORT */

import {describe} from 'fava';
import {createMemoryClient, createMemoryServer} from '../dist/index.js';
import {createHttpClient, createHttpServer} from '../dist/index.js';

/* HELPERS */

const procedures = {
  sum ( a, b ) {
    return a + b;
  },
  powerOfTwo ( a ) {
    return a ** 2;
  },
  throwCustom () {
    const error = new Error ( 'Some custom error' );
    error.code = 1;
    error.data = 'Some data';
    throw error;
  },
  throwGeneral () {
    const error = new Error ( 'Some general error' );
    throw error;
  }
};

const createTestHttpClient = () => {
  const port = 5173;
  const url = `http://localhost:${port}`;
  const server = createHttpServer ({ port, procedures });
  const client = createHttpClient ({ url });
  return {client, server};
};

const createTestMemoryClient = () => {
  const server = createMemoryServer ({ procedures });
  const client = createMemoryClient ({ server });
  return {client, server};
};

/* MAIN */

describe ( 'TinyRPC', () => {

  describe ( 'protocol', it => {

    it ( 'errors on invalid request, string', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( '' ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '' );
      t.is ( result.error.code, -1 );
      t.is ( result.error.message, 'Invalid request' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on invalid version', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: 2, id: '1' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '1' );
      t.is ( result.error.code, -2 );
      t.is ( result.error.message, 'Invalid version' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on invalid version, missing', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { id: '1' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '1' );
      t.is ( result.error.code, -2 );
      t.is ( result.error.message, 'Invalid version' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on unsupported version', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '2.0.0', id: '1' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '1' );
      t.is ( result.error.code, -3 );
      t.is ( result.error.message, 'Unsupported version' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on unsupported version, major.minor.path', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '1.0', id: '1' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '1' );
      t.is ( result.error.code, -3 );
      t.is ( result.error.message, 'Unsupported version' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on invalid id', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '1.0.0', id: 1 } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '' );
      t.is ( result.error.code, -4 );
      t.is ( result.error.message, 'Invalid id' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on invalid id, missing', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '1.0.0' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '' );
      t.is ( result.error.code, -4 );
      t.is ( result.error.message, 'Invalid id' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on invalid id, different case', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { 'ID': '1' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '' );
      t.is ( result.error.code, -4 );
      t.is ( result.error.message, 'Invalid id' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on invalid method', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '1.0.0', id: '1', method: 'missing' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '1' );
      t.is ( result.error.code, -5 );
      t.is ( result.error.message, 'Invalid method' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on invalid method, missing', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '1.0.0', id: '1' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '1' );
      t.is ( result.error.code, -5 );
      t.is ( result.error.message, 'Invalid method' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on invalid params', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '1.0.0', id: '1', method: 'sum', params: {} } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '1' );
      t.is ( result.error.code, -6 );
      t.is ( result.error.message, 'Invalid params' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on failed execution, with a custom error', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '1.0.0', id: '1', method: 'throwCustom' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '1' );
      t.is ( result.error.code, 1 );
      t.is ( result.error.message, 'Some custom error' );
      t.is ( result.error.data, 'Some data' );
      t.is ( result.result, undefined );

    });

    it ( 'errors on failed execution, with a general error', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '1.0.0', id: '1', method: 'throwGeneral' } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, '1' );
      t.is ( result.error.code, -7 );
      t.is ( result.error.message, 'Some general error' );
      t.is ( result.error.data, undefined );
      t.is ( result.result, undefined );

    });

    it ( 'succeeds on valid request', async t => {

      const {server} = createTestMemoryClient ();
      const result = ( await server.handle ( { version: '1.0.0', id: 'foo', method: 'sum', params: [1, 2] } ) ).valueOf ();

      t.is ( result.version, '1.0.0' );
      t.is ( result.id, 'foo' );
      t.is ( result.error, undefined );
      t.is ( result.result, 3 );

    });

  });

  describe ( 'roudtrip', () => {

    describe ( 'memory', it => {

      it ( 'errors on invalid request', async t => {

        const {client} = createTestMemoryClient ();

        try {

          await client.throwCustom ();

        } catch ( error ) {

          t.is ( error.code, 1 );
          t.is ( error.message, 'Some custom error' );
          t.is ( error.data, 'Some data' );

        }

      });

      it ( 'succeeds on valid request', async t => {

        const {client} = createTestMemoryClient ();
        const result = await client.sum ( 1, 2 );

        t.is ( result, 3 );

      });

    });

    describe ( 'http', it => {

      it ( 'errors on invalid request', async t => {

        const {client, server} = createTestHttpClient ();

        try {

          await client.throwCustom ();

        } catch ( error ) {

          t.is ( error.code, 1 );
          t.is ( error.message, 'Some custom error' );
          t.is ( error.data, 'Some data' );

          server.close ();

        }

      });

      it ( 'succeeds on valid request', async t => {

        const {client, server} = createTestHttpClient ();
        const result = await client.sum ( 1, 2 );

        t.is ( result, 3 );

        server.close ();

      });

    });

  });

});
