import { ApolloServer, BaseContext } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import express, { Request } from 'express'
import { gql } from 'graphql-tag'
import http from 'http'

export type ApolloServerForExpressMiddleware<C extends BaseContext> =
  Parameters<typeof expressMiddleware<C>>[0]

export type Context = { req: Request }

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const app = express()
const apollo = new ApolloServer<Context>({ typeDefs })

await apollo.start()

app.use(
  expressMiddleware<Context>(
    // Issue: TS reports an error on `expressMiddleware<Context>(apollo, ...)`:
    //   Argument of type
    //   'import(".../@apollo/server/dist/esm/ApolloServer", { with: { "resolution-mode": "import" } }).ApolloServer<RC>'
    //   is not assignable to parameter of type
    //   'import(".../@apollo/server/dist/cjs/ApolloServer").ApolloServer<Context>'.
    //   Types have separate declarations of a private property 'internals'.ts(2345)
    apollo as unknown as ApolloServerForExpressMiddleware<Context>,
    { context: async ({ req }) => ({ req }) }
  )
)

const server = http.createServer(app)

server.listen(4000, () =>
  console.log('Server started at http://localhost:4000/graphql')
)
