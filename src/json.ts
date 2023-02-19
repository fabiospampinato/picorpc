
/* MAIN */

const deserialize = ( value: string ): any => {

  return JSON.parse ( value );

};

const serialize = ( value: unknown ): string => {

  return JSON.stringify ( value );

};

/* EXPORT */

export {deserialize, serialize};
