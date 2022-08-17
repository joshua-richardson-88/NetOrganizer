// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { collectionsRouter } from './collection'
import { groupsRouter } from './group'
import { linksRouter } from './links'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('collections.', collectionsRouter)
  .merge('groups.', groupsRouter)
  .merge('links.', linksRouter)

// export type definition of API
export type AppRouter = typeof appRouter
