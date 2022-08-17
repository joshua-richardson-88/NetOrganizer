import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from './context'

const title = z.string().max(256, 'Max title length is 256')
const id = z.string().cuid()

const QueryAllSchema = z.object({ cID: id })
const CreateGroupSchema = z.object({ title, cID: id })
const UpdateInputSchema = z.object({ id, title })
const DeleteInputSchema = z.object({ id })

export type QueryAllInput = z.TypeOf<typeof QueryAllSchema>
export type CreateGroupInput = z.TypeOf<typeof CreateGroupSchema>
export type UpdateGroupInput = z.TypeOf<typeof UpdateInputSchema>
export type DeleteGroupInput = z.TypeOf<typeof DeleteInputSchema>
export const groupsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (ctx.passage.user.id.length < 2 && ctx.req?.cookies['psg_auth_token']) {
      try {
        const authToken = ctx.req.cookies['psg_auth_token']

        if (authToken == null) throw new Error('no cookie found')

        const verified = await ctx.passage.validAuthToken(authToken)

        if (verified == null) throw new Error('could not verify userToken')

        return next({
          ctx: {
            ...ctx,
            user: verified,
          },
        })
      } catch (error) {
        console.log('middleware 1 error')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            "User not currently logged in, they don't have access to this api",
        })
      }
    }
    return next()
  })
  .middleware(async ({ ctx, next }) => {
    // see if the passage user exists in our db
    const dbHasUser = await ctx.prisma.user.findFirst({
      where: { passageId: ctx.user },
    })
    // if the user doesn't exist yet, make them
    if (dbHasUser == null) {
      const dbUser = await ctx.prisma.user.create({
        data: { passageId: ctx.user },
      })
      if (dbUser == null)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'could not create new user',
        })

      // update the context
      return next({
        ctx: {
          ...ctx,
          user: dbUser.id,
        },
      })
    }
    // the user does exist, update the context
    return next({
      ctx: {
        ...ctx,
        user: dbHasUser.id,
      },
    })
  })
  .mutation('addNew', {
    input: CreateGroupSchema,
    async resolve({ ctx, input }) {
      const group = await ctx.prisma.group.create({
        data: {
          title: input.title,
          collection: {
            connect: {
              id: input.cID,
            },
          },
        },
      })

      return group
    },
  })
  .mutation('update', {
    input: UpdateInputSchema,
    async resolve({ ctx, input }) {
      const hasId = await ctx.prisma.group.findUnique({
        where: { id: input.id },
      })
      if (hasId == null) throw new TRPCError({ code: 'NOT_FOUND' })

      const updated = await ctx.prisma.group.update({
        data: { title: input.title },
        where: { id: input.id },
      })
      return updated
    },
  })
  .mutation('delete', {
    input: DeleteInputSchema,
    resolve({ ctx, input }) {
      return ctx.prisma.group.delete({
        where: { id: input.id },
      })
    },
  })
  .query('getAll', {
    input: QueryAllSchema,
    resolve({ ctx: { prisma }, input }) {
      return prisma.group.findMany({
        where: { collectionId: input.cID },
        select: { title: true, id: true },
      })
    },
  })
