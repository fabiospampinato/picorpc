
import createMemoryClient from "./src/clients/memory";
import createMemoryServer from "./src/servers/memory";
import type {IMemoryClient} from "./src/types";

const procedures = {
  sum ( a: number, b: number ) {
    return a + b;
  },
  powerOfTwo ( a: number ) {
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

type IProcedures = typeof procedures;

const createTestClient = () => {
  const server = createMemoryServer ({ procedures });
  const client = createMemoryClient<{ sum: ( a: number, b: number ) => 123 }> ({ server });
  client.sum ( 123, 'asd' );
  return {client, server};
};

type Asd = IMemoryClient<{ sum: ( a: number, b: number ) => 123 }>;
let asd: Asd;
asd.sum ( 123, 'asd' )

// const {client, server} = createTestClient ();
// client.sum ( 1, 2 ).then ( console.log );
// client.
