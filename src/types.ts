
/* IMPORT */

import type Request from '~/objects/request';
import type Response from '~/objects/response';

/* TYPES - OBJECTS */

type IContext = {
  [K in string]: unknown
};

type IProcedures = {
  [Method in string]: ( ...params: any[] ) => any
};

type IRequest = {
  version: string,
  id: string,
  method: string,
  params?: unknown[],
  context?: IContext
};

type IResponseSuccess = {
  version: string,
  id: string,
  result: unknown
};

type IResponseError = {
  version: string,
  id: string,
  error: {
    code: number,
    message: string,
    data?: unknown
  }
};

type IResponse = IResponseSuccess | IResponseError;

type IRequestHandler = ( request: IRequest ) => Promise<Response>;

type IResponseHandler = ( response: IResponse ) => void;

/* TYPES - ABSTRACT */

type IAbstractClientOptions = {
  context?: () => IContext,
  handler: IRequestHandler
};

type IAbstractServerOptions<T extends IProcedures> = {
  procedures: T,
  handler: IResponseHandler
};

type IAbstractClient<T extends IProcedures> = {
  [Method in keyof T]: ( ...params: Parameters<T[Method]> ) => Request<ReturnType<T[Method]>>
};

type IAbstractServer = {
  handle: ( request: IRequest ) => Promise<Response>
};

/* TYPES - MEMORY */

type IMemoryClientOptions = {
  context?: () => IContext,
  server: IMemoryServer
};

type IMemoryServerOptions<T extends IProcedures> = {
  procedures: T
};

type IMemoryClient<T extends IProcedures> = IAbstractClient<T>;

type IMemoryServer = IAbstractServer;

/* TYPES - HTTP */

type IHttpClientOptions = {
  context?: () => IContext,
  serializer?: ( value: unknown ) => string,
  deserializer?: ( value: string ) => any,
  url: string
};

type IHttpServerOptions<T extends IProcedures> = {
  serializer?: ( value: unknown ) => string,
  deserializer?: ( value: string ) => any,
  port: number,
  procedures: T
};

type IHttpClient<T extends IProcedures> = IAbstractClient<T>;

type IHttpServer = IAbstractServer & {
  close: () => void
};

/* EXPORT */

export type {IContext, IProcedures, IRequest, IResponse, IRequestHandler, IResponseHandler};
export type {IAbstractClientOptions, IAbstractServerOptions, IAbstractClient, IAbstractServer};
export type {IMemoryClientOptions, IMemoryServerOptions, IMemoryClient, IMemoryServer};
export type {IHttpClientOptions, IHttpServerOptions, IHttpClient, IHttpServer};
