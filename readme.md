# PicoRPC

A tiny RPC library and [spec](./spec.md), inspired by [JSON-RPC 2.0](https://www.jsonrpc.org/specification) and [tRPC](https://trpc.io).

## Install

```sh
npm install --save picorpc
```

## Usage

```ts
import {createAbstractClient, createAbstractServer} from 'picorpc';
import {createMemoryClient, createMemoryServer} from 'picorpc';
import {createHttpClient, createHttpServer} from 'picorpc';

// Custom map of procedures to expose to the client

const Procedures = {
  ctx () { // This procedure reads something from the context, which will be attached to "this"
    return this.value;
  },
  sum ( a, b ) { // This procedure is a simple pure function that doesn't use the context
    return a + b;
  },
  throw () { // This procedure throws, with a custom error code and data value
    const error = new Error ( 'Some custom error' );
    error.code = 1;
    error.data = 'Some data';
    throw error;
  }
};

// Create an in-memory client/server
// An in-memory server behind a proper HTTP server is the recommended way to expose procedures via an API
// An in-memory client is mostly useful for testing

const server = createMemoryServer ({
  procedures: Procedures
});

const client = createMemoryClient ({
  server, // The in-memory server to pass requests to
  context: () => ({ // Custom, optional, context object, which will be attached to every request automatically
    value: 123
  })
});

await client.sum ( 1, 2 ); // => 3
await client.ctx (); // => 123
await client.throw (); // => This will throw

// Create an HTTP client/server
// The HTTP server is intended for simple internal inter-process communication
// The HTTP client makes request with the fetch API, so it works everywhere

const client = createHttpClient ({
  context: () => ({ // Custom, optional, context object, which will be attached to every request automatically
    value: 123
  }),
  serializer: JSON.stringify, // Custom, optional, serializer
  deserializer: JSON.parse, // Custom, optional, deserializer
  url: 'http://localhost:6000' // Required endpoint URL
});

const server = createHttpServer ({
  serializer: JSON.stringify, // Custom, optional, serializer
  deserializer: JSON.parse, // Custom, optional, deserializer
  port: 6000, // The port to start listening at
  procedures: Procedures
});

await client.sum ( 1, 2 ); // => 3
await client.ctx (); // => 123
await client.throw (); // => This will throw

server.close (); // Close the server, stopping listening

// Create an abstract server, to use your own transport protocol

const client = createAbstractClient ({
  handler: request => {
    //TODO: Send the request somewhere and read the result back
  }
});

const client = createAbstractServer ({
  procedures: Procedures,
  handler: response => {
    //TODO: Do something with the response object, optionally
  }
});
```

## License

MIT © Fabio Spampinato
