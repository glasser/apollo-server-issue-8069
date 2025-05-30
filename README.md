# @as-integrations/express5@1.0.0 expressMiddleware ApolloServer parameter type issue

## Requirements

- [Node.js](https://nodejs.org/en/download/current) and [pnpm](https://pnpm.io/installation)

## Getting started

```sh
pnpm install   # install dependencies
pnpm dev       # start development server
```

## Issue

TS reports an error on `expressMiddleware<Context>(apollo, ...)`:

```
Argument of type
'import(".../@apollo/server/dist/esm/ApolloServer", { with: { "resolution-mode": "import" } }).ApolloServer<RC>'
is not assignable to parameter of type
'import(".../@apollo/server/dist/cjs/ApolloServer").ApolloServer<Context>'.
Types have separate declarations of a private property 'internals'.ts(2345)
```

## Workaround

```ts
export type ApolloServerForExpressMiddleware<C extends BaseContext> =
  Parameters<typeof expressMiddleware<C>>[0]

expressMiddleware<Context>(apollo as unknown as ApolloServerForExpressMiddleware<Context>, ...)
```
