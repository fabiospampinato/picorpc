# TinyRPC v1 Specification

## Overview

This document describes the TinyRPC v1 protocol, a remote-procedure-call protocol meant to be very simple, but mighty.

This protocol requires [JSON](https://www.json.org/json-en.html) ([RFC 4627](https://www.ietf.org/rfc/rfc4627.txt)) as the serialization and deserialization format, but you may easily swap that out for something more appropriate for your use case to customize the protocol to your specific needs.

This protocol is agnostic to the transport protocol used to exchange messages, it could be http, tpc, sockets... you decide.

This is a client-server protocol, and the rest of the document describes the objects needed to implement it, as well as their mandated behavior.

Every property listed is considered to be case-sensitive, any additional non-listed properties should have no effect on how the protocol works.

## Request

An RPC call is initiated when the client sends a request object to the server.

A request object must have the following properties:

- `version`
  - The version of the protocol used.
  - This property is required.
  - This property must be exactly "1.0.0".
- `id`
  - The identifier for this request.
  - This property is required.
  - This property must be a string, any string is allowed.
- `method`
  - The name of the procedure to call on the server.
  - This property is required.
  - This property must be a string.
- `params`
  - The list of arguments to call the remote procedure with.
  - The property is optional, so it can be omitted.
  - The property must be an array.

## Response

The server must respond to the client's request with a response object, which must be either a sucessful or an unsuccessful one.

Any response objects must have the following properties:

- `version`
  - The version of the protocol used,
  - This property is required.
  - This property must be exactly "1.0.0".
- `id`
  - The identifier for this response.
  - This property is required.
  - This property must have the same value as the `id` property on the correspending request object, unless that property wasn't provided, in which case an empty string will be used instead.

Additionally, a successful response object must have also the following properties:

- `result`
  - The return value for the RPC call.
  - This property is required.
  - This property could have any value.

Additionally, an unsuccessful response object must have also the following properties:

- `error`
  - An object containing details about the error.
  - This property is required.
  - This object has the following properties:
    - `code`
      - An integer number, the identifier for the error.
      - This property is required.
      - Negative integers are reserved, custom ones must be postiive integeres.
    - `message`
      - A string describing the error.
      - This property is required.
    - `data`
      - A property containing arbitrary data accompanying the error.
      - This property is optional, so it can be omitted.

## Errors

Negative integer error codes are reserved, custom error codes must be positive integers.

The following are all the "well known" reserved error codes, along with their recommended accompanying error messages, that the server may decide to return.

| Code | Message               | Meaning                                                              |
| ---- | --------------------- | -------------------------------------------------------------------- |
| `-1` | `Invalid request`     | Generic error about the format of the request                        |
| `-2` | `Invalid version`     | Generic error about the format of the version                        |
| `-3` | `Unsupported version` | Unsupported protocol version                                         |
| `-4` | `Invalid id`          | Generic error about the format of the id                             |
| `-5` | `Invalid method`      | Generic error about the format of the method, or procedure not found |
| `-6` | `Invalid params`      | Generic error about the parameters provided for the procedure        |
| `-7` | `Failed execution`    | Generic error when executing the procedure                           |

## Batching

Sending multiple requests at once to the server is supported too, and it's done by sending multiple request objects in a single array, to which the server replies with an equal number of response objects in an array, potentially in a different order.

If the request is malformed, or if there is any other problem that prevents the server from knowing how many requests are being performed in a single batch, or if the number of requeests is 0, then the server must respond with a single unsuccessful response object.

## Examples

The following are some example requests and responses, to more practically illustrate how the protocol works.

Simple successfull call:

```
--> { "version": "1.0.0", "id": "1", "method: "add", "params": [1, 2] }
<-- { "version": "1.0.0", "id": "1", "result": 3 }
```

Simple unsuccessful call:

```
--> { "version": "1.0.0", "id": "1", "method: "add", "params": ["2"] }
<-- { "version": "1.0.0", "id": "1", "error": { "code": -6, "message": "Invalid params" } }
```

Unsuccessful calls:

```
--> "some string"
<-- { "version": "1.0.0", "id": "", "error": { "code": -1, "message": "Invalid request" } }

--> { "version": "1.0" }
<-- { "version": "1.0.0", "id": "", "error": { "code": -2, "message": "Invalid version" } }

--> { "version": "3.0.0" }
<-- { "version": "1.0.0", "id": "", "error": { "code": -3, "message": "Unsupported version" } }

--> { "version": "1.0.0", "id": 1 }
<-- { "version": "1.0.0", "id": "", "error": { "code": -4, "message": "Invalid id" } }

--> { "version": "1.0.0", "id": "1", "method": "addition" }
<-- { "version": "1.0.0", "id": "1", "error": { "code": -5, "message": "Invalid method" } }

--> { "version": "1.0.0", "id": "1", "method": "add" }
<-- { "version": "1.0.0", "id": "1", "error": { "code": -6, "message": "Invalid params" } }

--> { "version": "1.0.0", "id": "1", "method": "divide", "params": [0, 0] }
<-- { "version": "1.0.0", "id": "1", "error": { "code": -7, "message": "Failed execution" } }
```

Successful batch call:

```
--> [
      { "version": "1.0.0", "id": "1", "method: "add", "params": [1, 2] },
      { "version": "1.0.0", "id": "2", "method: "add", "params": [10, 20] }
    ]
<-- [
      { "version": "1.0.0", "id": "2", "result": 30 },
      { "version": "1.0.0", "id": "1", "result": 3 }
    ]
```

Partially successful batch call:

```
--> [
      { "version": "1.0.0", "id": "1", "method: "divide", "params": [0, 0] },
      { "version": "1.0.0", "id": "2", "method: "divide", "params": [10, 2] }
    ]
<-- [
      { "version": "1.0.0", "id": "1", "error": { "code": -7, "message": "Failed execution" } },
      { "version": "1.0.0", "id": "2", "result": 5 }
    ]
```

Malformed back call:

```
--> [ "add", "divide" ]
<-- { "version": "1.0.0", "id": "", "error": { "code": -1, "message": "Invalid request" } }
```

## License

MIT © Fabio Spampinato
