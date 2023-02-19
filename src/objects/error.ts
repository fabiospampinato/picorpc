
/* MAIN */

class RPCError extends Error {

  /* VARIABLES */

  code: number;
  data: unknown;

  /* CONSTRUCTOR */

  constructor ( code: number, message: string, data?: unknown ) {

    super ( message );

    this.code = code;
    this.data = data;

  }

}

/* EXPORT */

export default RPCError;
