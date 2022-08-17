// src/server/router/context.ts
import Passage from '@passageidentity/passage-node'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { env } from '../../env/server.mjs'
import { prisma } from '../db/client'

const passage = new Passage({
  appID: env.PASSAGE_APP_ID,
  apiKey: env.PASSAGE_API_KEY,
  authStrategy: 'HEADER',
})

export const createContext = (opts?: trpcNext.CreateNextContextOptions) => {
  const req = opts?.req
  const res = opts?.res

  return {
    req,
    res,
    passage,
    user: '',
    prisma,
  }
}

type Context = trpc.inferAsyncReturnType<typeof createContext>

export const createRouter = () => trpc.router<Context>()
