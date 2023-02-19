
/* IMPORT */

import type Request from '~/objects/request';
import type Response from '~/objects/response';

/* TYPES - OBJECTS */

type IProcedures = {
  [Method in string]: ( ...params: any[] ) => any
};

type IRequest = {
  version: string,
  id: string,
  method: string,
  params?: unknown[]
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

type IRequestsHandler = ( requests: IRequest[] ) => Promise<Response[] | Response>;

type IResponseHandler = ( response: IResponse ) => void;

/* TYPES - ABSTRACT */

type IAbstractClientOptions = {
  handler: IRequestHandler
};

type IAbstractServerOptions<T extends IProcedures> = {
  procedures: T,
  handler: IResponseHandler
};

type IAbstractClient<T extends IProcedures> = {
  [Method in keyof T]: ( ...params: Parameters<T[Method]> ) => Request<ReturnType<T[Method]>>
} & {
  batch: ( requests: Request<unknown>[] ) => Request<Response[] | Response>
};

type IAbstractServer = {
  handle ( requests: IRequest[] ): Promise<Response[] | Response>,
  handle ( request: IRequest ): Promise<Response>
};

/* TYPES - MEMORY */

type IMemoryClientOptions = {
  server: IMemoryServer
};

type IMemoryServerOptions<T extends IProcedures> = {
  procedures: T
};

type IMemoryClient<T extends IProcedures> = IAbstractClient<T>;

type IMemoryServer = IAbstractServer;

/* TYPES - HTTP */

type IHttpClientOptions = {
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

export type {IProcedures, IRequest, IResponse, IRequestHandler, IRequestsHandler, IResponseHandler};
export type {IAbstractClientOptions, IAbstractServerOptions, IAbstractClient, IAbstractServer};
export type {IMemoryClientOptions, IMemoryServerOptions, IMemoryClient, IMemoryServer};
export type {IHttpClientOptions, IHttpServerOptions, IHttpClient, IHttpServer};