import { ApolloServer, BaseContext } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import express, { Request } from 'express'
import { gql } from 'graphql-tag'
import http from 'http'

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
    apollo,
    { context: async ({ req }) => ({ req }) }
  )
)

const server = http.createServer(app)

server.listen(4000, () =>
  console.log('Server started at http://localhost:4000/graphql')
)
