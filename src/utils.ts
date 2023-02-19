
/* MAIN */

const attempt = <T, U> ( fn: () => T, fallback: U ): T | U => {

  try {

    return fn ();

  } catch {

    return fallback;

  }

};

const castError = ( exception: unknown ): Error & { code?: unknown, data?: unknown } => {

  if ( isError ( exception ) ) return exception;

  if ( isString ( exception ) ) return new Error ( exception );

  return new Error ( 'Unknown error' );

};

const identity = <T> ( value: T ): T => {

  return value;

};

const isArray = ( value: unknown ): value is unknown[] => {

  return Array.isArray ( value );

};

const isError = ( value: unknown ): value is Error => {

  return value instanceof Error;

};

const isFinite = ( value: unknown ): value is number => {

  return typeof value === 'number' && Number.isFinite ( value );

};

const isInteger = ( value: unknown ): value is number => {

  return typeof value === 'number' && Number.isInteger ( value );

};

const isNumber = ( value: unknown ): value is number => {

  return typeof value === 'number';

};

const isObject = ( value: unknown ): value is object => {

  return typeof value === 'object' && value !== null;

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const isUndefined = ( value: unknown ): value is undefined => {

  return typeof value === 'undefined';

};

const isVersionCompatible = ( version: string, supported: string ): boolean => { // Only MAJOR.MINOR.PATCH versions are supported

  const parse = ( version: string ) => {
    const [major, minor, patch] = version.split ( '.' ).map ( Number );
    const valid = [major, minor, patch].every ( isFinite );
    return {major, minor, patch, valid};
  };

  const v = parse ( version );
  const s = parse ( supported );

  if ( !v.valid || !s.valid ) return false; // Invalid version(s)

  if ( v.major !== s.major ) return false; // Incompatible major version

  if ( v.minor > s.minor ) return false; // Incompatible minor version

  if ( v.minor === s.minor && v.patch > s.patch ) return false; // Incompatible patch version

  return true;

};

/* EXPORT */

export {attempt, castError, identity, isArray, isError, isFinite, isInteger, isNumber, isObject, isString, isUndefined, isVersionCompatible};
