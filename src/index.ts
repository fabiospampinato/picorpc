
//TODO: Make a bunch of demos, maybe

/* IMPORT */

import {VERSION} from '~/constants';

import Error from '~/objects/error';
import Request from '~/objects/request';
import Response from '~/objects/response';

import createAbstractClient from '~/clients/abstract';
import createAbstractServer from '~/servers/abstract';

import createMemoryClient from '~/clients/memory';
import createMemoryServer from '~/servers/memory';

import createHttpClient from '~/clients/http';
import createHttpServer from '~/servers/http';

import type {IContext, IProcedures, IRequest, IResponse} from '~/types';
import type {IAbstractClientOptions, IAbstractServerOptions, IAbstractClient, IAbstractServer} from '~/types';
import type {IMemoryClientOptions, IMemoryServerOptions, IMemoryClient, IMemoryServer} from '~/types';
import type {IHttpClientOptions, IHttpServerOptions, IHttpClient, IHttpServer} from '~/types';

/* EXPORT */

export {VERSION};
export {Error, Request, Response};
export {createAbstractClient, createAbstractServer};
export {createMemoryClient, createMemoryServer};
export {createHttpClient, createHttpServer};

export type {IContext, IProcedures, IRequest, IResponse};
export type {IAbstractClientOptions, IAbstractServerOptions, IAbstractClient, IAbstractServer};
export type {IMemoryClientOptions, IMemoryServerOptions, IMemoryClient, IMemoryServer};
export type {IHttpClientOptions, IHttpServerOptions, IHttpClient, IHttpServer};
