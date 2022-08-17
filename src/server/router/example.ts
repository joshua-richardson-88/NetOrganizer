import { createRouter } from './context'
import { z } from 'zod'

// export const collectionRouter = createRouter().mutation('addTopic', {
//   resolve: async ({ ctx }) => {
//     const topic = await ctx.prisma.collection.create({ data: {
//       title: 'New Topic',

//     }})
//   },
// })
export const exampleRouter = createRouter()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany()
    },
  })
